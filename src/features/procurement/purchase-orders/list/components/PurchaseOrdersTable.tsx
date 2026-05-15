// 拆分说明：从 PurchaseOrdersPage.tsx 抽出采购列表表格展示区；页面层只负责装配。

import { Link } from "react-router-dom";

import type { PurchaseOrderOut } from "../../../../../domains/procurement/read/purchaseOrdersClient";
import type { PurchaseOrdersLoadState } from "../types";
import {
  completionClass,
  completionLabel,
  formatAmount,
  formatDateTime,
  statusLabel,
} from "../utils";

interface PurchaseOrdersTableProps {
  rows: PurchaseOrderOut[];
  loadState: PurchaseOrdersLoadState;
}

export function PurchaseOrdersTable({ rows, loadState }: PurchaseOrdersTableProps) {
  return (
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
  );
}
