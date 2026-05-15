// 拆分说明：从 PurchaseOrderDetailPage.tsx 抽出采购行表格展示区，页面层只负责装配。

import type { PurchaseOrderOut } from "../../../../../domains/procurement/read/purchaseOrdersClient";
import { formatAmount } from "../utils";

export function PurchaseOrderLinesTable({ order }: { order: PurchaseOrderOut }) {
  return (
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
                    <div className="cell-muted">× {line.purchase_ratio_to_base_snapshot}</div>
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
  );
}
