import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageTitle from "../../../components/ui/PageTitle";
import {
  type WmsReceivingInboxSyncAndApplyOut,
  syncAndApplyWmsReceivingInbox,
} from "../../../domains/procurement/ops/wmsReceivingInboxOpsClient";
import {
  type PurchaseOrderOut,
  fetchPurchaseOrders,
} from "../../../domains/procurement/read/purchaseOrdersClient";

type LoadState =
  | { state: "idle" | "loading" }
  | { state: "success"; rows: PurchaseOrderOut[] }
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

function formatAmount(value: string): string {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return value || "0.00";

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

function ResultPanel({ result }: { result: WmsReceivingInboxSyncAndApplyOut }) {
  return (
    <div className="page-card">
      <h2>WMS 收货同步结果</h2>
      <dl className="description-list">
        <div>
          <dt>同步读取</dt>
          <dd>
            fetched={result.sync.fetched_count} / upserted={result.sync.upserted_count}
          </dd>
        </div>
        <div>
          <dt>完成状态应用</dt>
          <dd>
            pending={result.apply.pending_count} / applied={result.apply.applied_count} /
            failed={result.apply.failed_count}
          </dd>
        </div>
        <div>
          <dt>next_after_event_id</dt>
          <dd>{result.sync.next_after_event_id}</dd>
        </div>
      </dl>
    </div>
  );
}

export default function PurchaseOrdersPage() {
  const [filters, setFilters] = useState({ q: "", status: "" });
  const [appliedFilters, setAppliedFilters] = useState({ q: "", status: "" });
  const [loadState, setLoadState] = useState<LoadState>({ state: "idle" });

  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState("");
  const [syncResult, setSyncResult] = useState<WmsReceivingInboxSyncAndApplyOut | null>(null);

  const loadOrders = useCallback(async () => {
    setLoadState({ state: "loading" });

    try {
      const rows = await fetchPurchaseOrders({
        limit: 100,
        q: appliedFilters.q || undefined,
        status: appliedFilters.status || undefined,
      });
      setLoadState({ state: "success", rows });
    } catch (error) {
      setLoadState({
        state: "error",
        message: error instanceof Error ? error.message : "加载采购列表失败",
      });
    }
  }, [appliedFilters]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  async function handleSync() {
    setSyncing(true);
    setSyncError("");
    setSyncResult(null);

    try {
      const result = await syncAndApplyWmsReceivingInbox({
        after_event_id: 0,
        limit: 200,
        apply_limit: 500,
      });
      setSyncResult(result);
      await loadOrders();
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : "同步 WMS 收货结果失败");
    } finally {
      setSyncing(false);
    }
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAppliedFilters(filters);
  }

  const rows = loadState.state === "success" ? loadState.rows : [];

  return (
    <div className="page-stack">
      <PageTitle
        title="采购列表"
        description="采购系统 owner 数据列表。WMS 收货结果通过右侧按钮同步回采购完成状态。"
        actions={
          <>
            <Link className="button button-secondary" to="/procurement/purchase-orders/new">
              新建采购单
            </Link>
            <button
              type="button"
              className="button button-primary"
              disabled={syncing}
              onClick={() => {
                void handleSync();
              }}
            >
              {syncing ? "同步中…" : "同步 WMS 收货结果"}
            </button>
          </>
        }
      />

      {syncError ? <div className="alert alert-error">{syncError}</div> : null}
      {syncResult ? <ResultPanel result={syncResult} /> : null}

      <div className="page-card">
        <form className="filter-bar" onSubmit={handleSearchSubmit}>
          <label>
            <span>关键词</span>
            <input
              value={filters.q}
              placeholder="采购单号 / 供应商 / 采购人"
              onChange={(event) => setFilters((prev) => ({ ...prev, q: event.target.value }))}
            />
          </label>

          <label>
            <span>订单状态</span>
            <select
              value={filters.status}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, status: event.target.value }))
              }
            >
              <option value="">全部</option>
              <option value="CREATED">已创建</option>
              <option value="CLOSED">已关闭</option>
              <option value="CANCELED">已取消</option>
            </select>
          </label>

          <div className="filter-actions">
            <button type="submit" className="button button-primary">
              查询
            </button>
            <button
              type="button"
              className="button button-secondary"
              onClick={() => {
                setFilters({ q: "", status: "" });
                setAppliedFilters({ q: "", status: "" });
              }}
            >
              重置
            </button>
          </div>
        </form>
      </div>

      <div className="page-card">
        <div className="table-header">
          <h2>采购订单</h2>
          {loadState.state === "loading" ? <span>加载中…</span> : null}
        </div>

        {loadState.state === "error" ? (
          <div className="alert alert-error">{loadState.message}</div>
        ) : null}

        {loadState.state !== "error" ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>采购单号</th>
                  <th>供应商</th>
                  <th>目标仓库</th>
                  <th>订单状态</th>
                  <th>完成状态</th>
                  <th>计划 / 已收 / 剩余</th>
                  <th>采购时间</th>
                  <th className="text-right">总金额</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="empty-cell">
                      暂无采购单
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <Link
                          className="table-link"
                          to={`/procurement/purchase-orders/${row.id}`}
                        >
                          {row.po_no}
                        </Link>
                        <div className="cell-muted">#{row.id}</div>
                      </td>
                      <td>
                        <div>{row.supplier_name_snapshot}</div>
                        <div className="cell-muted">{row.supplier_code_snapshot}</div>
                      </td>
                      <td>
                        <div>{row.target_warehouse_name_snapshot || "-"}</div>
                        <div className="cell-muted">
                          {row.target_warehouse_code_snapshot || `#${row.target_warehouse_id}`}
                        </div>
                      </td>
                      <td>
                        <span className="status-pill status-muted">{statusLabel(row.status)}</span>
                      </td>
                      <td>
                        <span className={completionClass(row.completion_status)}>
                          {completionLabel(row.completion_status)}
                        </span>
                      </td>
                      <td>
                        {row.total_ordered_base} / {row.total_received_base} /{" "}
                        {row.total_remaining_base}
                      </td>
                      <td>{formatDateTime(row.purchase_time)}</td>
                      <td className="text-right">{formatAmount(row.total_amount)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
