import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import PageTitle from "../../../components/ui/PageTitle";
import {
  type PurchaseOrderOut,
  fetchPurchaseOrder,
} from "../../../domains/procurement/read/purchaseOrdersClient";

type LoadState =
  | { state: "loading" }
  | { state: "success"; data: PurchaseOrderOut }
  | { state: "error"; message: string };

const statusLabels: Record<string, string> = {
  CREATED: "已创建",
  CLOSED: "已关闭",
  CANCELED: "已取消",
};

const completionLabels: Record<string, string> = {
  NOT_RECEIVED: "未收货",
  PARTIAL: "部分收货",
  RECEIVED: "已收货",
};

function formatDateTime(value: string | null): string {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatAmount(value: string | null): string {
  if (!value) return "0.00";

  const amount = Number(value);
  if (!Number.isFinite(amount)) return value;

  return amount.toFixed(2);
}

function statusLabel(value: string): string {
  return statusLabels[value] ?? value;
}

function completionLabel(value: string): string {
  return completionLabels[value] ?? value;
}

function completionClass(value: string): string {
  if (value === "RECEIVED") return "status-pill status-success";
  if (value === "PARTIAL") return "status-pill status-warning";
  return "status-pill status-muted";
}

export default function PurchaseOrderDetailPage() {
  const params = useParams<{ poId: string }>();
  const poId = Number(params.poId);
  const [loadState, setLoadState] = useState<LoadState>({ state: "loading" });

  useEffect(() => {
    let alive = true;

    if (!Number.isInteger(poId) || poId <= 0) {
      setLoadState({ state: "error", message: "采购单 ID 无效" });
      return () => {
        alive = false;
      };
    }

    setLoadState({ state: "loading" });

    fetchPurchaseOrder(poId)
      .then((data) => {
        if (alive) {
          setLoadState({ state: "success", data });
        }
      })
      .catch((error: unknown) => {
        if (alive) {
          setLoadState({
            state: "error",
            message: error instanceof Error ? error.message : "加载采购单详情失败",
          });
        }
      });

    return () => {
      alive = false;
    };
  }, [poId]);

  if (loadState.state === "loading") {
    return (
      <div className="page-stack">
        <PageTitle title="采购单详情" description="正在加载采购单详情..." />
        <div className="page-card">加载中…</div>
      </div>
    );
  }

  if (loadState.state === "error") {
    return (
      <div className="page-stack">
        <PageTitle
          title="采购单详情"
          actions={
            <Link className="button button-secondary" to="/procurement/purchase-orders">
              返回采购列表
            </Link>
          }
        />
        <div className="alert alert-error">{loadState.message}</div>
      </div>
    );
  }

  const order = loadState.data;

  return (
    <div className="page-stack">
      <PageTitle
        title={`采购单详情 · ${order.po_no}`}
        description="采购单 owner 数据来自 procurement-api；WMS 只回传收货执行结果。"
        actions={
          <Link className="button button-secondary" to="/procurement/purchase-orders">
            返回采购列表
          </Link>
        }
      />

      <div className="page-card">
        <h2>采购单头</h2>
        <dl className="description-list">
          <div>
            <dt>采购单号</dt>
            <dd>{order.po_no}</dd>
          </div>
          <div>
            <dt>供应商</dt>
            <dd>
              {order.supplier_name_snapshot}（{order.supplier_code_snapshot}）
            </dd>
          </div>
          <div>
            <dt>目标仓库</dt>
            <dd>
              {order.target_warehouse_name_snapshot || "-"}（
              {order.target_warehouse_code_snapshot || `#${order.target_warehouse_id}`}）
            </dd>
          </div>
          <div>
            <dt>采购人</dt>
            <dd>{order.purchaser}</dd>
          </div>
          <div>
            <dt>采购时间</dt>
            <dd>{formatDateTime(order.purchase_time)}</dd>
          </div>
          <div>
            <dt>订单状态</dt>
            <dd>
              <span className="status-pill status-muted">{statusLabel(order.status)}</span>
            </dd>
          </div>
          <div>
            <dt>完成状态</dt>
            <dd>
              <span className={completionClass(order.completion_status)}>
                {completionLabel(order.completion_status)}
              </span>
            </dd>
          </div>
          <div>
            <dt>计划 / 已收 / 剩余</dt>
            <dd>
              {order.total_ordered_base} / {order.total_received_base} /{" "}
              {order.total_remaining_base}
            </dd>
          </div>
          <div>
            <dt>最后收货时间</dt>
            <dd>{formatDateTime(order.last_received_at)}</dd>
          </div>
          <div>
            <dt>总金额</dt>
            <dd>{formatAmount(order.total_amount)}</dd>
          </div>
          <div>
            <dt>备注</dt>
            <dd>{order.remark || "-"}</dd>
          </div>
        </dl>
      </div>

      <div className="page-card">
        <div className="table-header">
          <h2>采购行</h2>
          <span>{order.lines.length} 行</span>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>行号</th>
                <th>商品</th>
                <th>规格</th>
                <th>采购单位</th>
                <th>下单数量</th>
                <th>基础数量</th>
                <th className="text-right">单价</th>
                <th className="text-right">折扣</th>
                <th className="text-right">行金额</th>
              </tr>
            </thead>
            <tbody>
              {order.lines.length === 0 ? (
                <tr>
                  <td colSpan={9} className="empty-cell">
                    暂无采购行
                  </td>
                </tr>
              ) : (
                order.lines.map((line) => (
                  <tr key={line.id}>
                    <td>{line.line_no}</td>
                    <td>
                      <div className="cell-strong">{line.item_name_snapshot}</div>
                      <div className="cell-muted">
                        {line.item_sku_snapshot || `item#${line.item_id}`}
                      </div>
                    </td>
                    <td>{line.spec_text_snapshot || "-"}</td>
                    <td>
                      <div>{line.purchase_uom_name_snapshot}</div>
                      <div className="cell-muted">
                        × {line.purchase_ratio_to_base_snapshot}
                      </div>
                    </td>
                    <td>{line.qty_ordered_input}</td>
                    <td>{line.qty_ordered_base}</td>
                    <td className="text-right">{formatAmount(line.supply_price)}</td>
                    <td className="text-right">{formatAmount(line.discount_amount)}</td>
                    <td className="text-right">{formatAmount(line.line_amount)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
