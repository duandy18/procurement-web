import type {
  PurchaseOrderCreateLineDraft,
} from "../model/usePurchaseOrderCreateController";
import {
  lineAmount,
  lineBaseQty,
} from "../model/usePurchaseOrderCreateController";
import type {
  PmsReadItemBasicOut,
  PmsReadUomOut,
} from "../../../../../domains/procurement/read/purchaseOrdersClient";

interface PurchaseOrderCreateLinesEditorProps {
  supplierSelected: boolean;
  itemKeyword: string;
  items: PmsReadItemBasicOut[];
  lines: PurchaseOrderCreateLineDraft[];
  uomsByLineId: Record<string, PmsReadUomOut[]>;
  loadingItems: boolean;
  onChangeItemKeyword: (value: string) => void;
  onSearchItems: () => void;
  onAddLine: () => void;
  onRemoveLine: (clientId: string) => void;
  onChangeLine: <K extends keyof PurchaseOrderCreateLineDraft>(
    clientId: string,
    key: K,
    value: PurchaseOrderCreateLineDraft[K],
  ) => void;
  onChangeLineItem: (clientId: string, itemId: string) => void;
}

function itemLabel(item: PmsReadItemBasicOut): string {
  const spec = item.spec ? ` / ${item.spec}` : "";
  return `${item.sku} · ${item.name}${spec}`;
}

export function PurchaseOrderCreateLinesEditor({
  supplierSelected,
  itemKeyword,
  items,
  lines,
  uomsByLineId,
  loadingItems,
  onChangeItemKeyword,
  onSearchItems,
  onAddLine,
  onRemoveLine,
  onChangeLine,
  onChangeLineItem,
}: PurchaseOrderCreateLinesEditorProps) {
  return (
    <section className="page-card">
      <div className="table-header">
        <div>
          <h2>采购行明细</h2>
          <p className="cell-muted">
            商品和单位通过 procurement-api BFF 读取 PMS read-v1；不会从前端直连 PMS。
          </p>
        </div>

        <button
          type="button"
          className="button button-secondary"
          disabled={!supplierSelected}
          onClick={onAddLine}
        >
          + 添加一行
        </button>
      </div>

      <div className="filter-bar">
        <label>
          <span>商品关键词</span>
          <input
            value={itemKeyword}
            disabled={!supplierSelected}
            placeholder={supplierSelected ? "SKU / 商品名 / 条码" : "请先选择供应商"}
            onChange={(event) => onChangeItemKeyword(event.target.value)}
          />
        </label>

        <div className="filter-actions">
          <button
            type="button"
            className="button button-primary"
            disabled={!supplierSelected || loadingItems}
            onClick={onSearchItems}
          >
            {loadingItems ? "查询中…" : "查询商品"}
          </button>
        </div>

        <div className="alert">
          已加载商品：{items.length} 个。选择商品后会自动加载该商品采购单位。
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>商品</th>
              <th>商品信息</th>
              <th>采购单位</th>
              <th>数量</th>
              <th>预计 BASE</th>
              <th className="text-right">BASE 单价</th>
              <th className="text-right">折扣金额</th>
              <th>行备注</th>
              <th className="text-right">预计行金额</th>
              <th>操作</th>
            </tr>
          </thead>

          <tbody>
            {lines.map((line, index) => {
              const uoms = uomsByLineId[line.clientId] ?? [];
              const selectedItem = items.find((item) => String(item.id) === line.itemId);

              return (
                <tr key={line.clientId}>
                  <td>{index + 1}</td>
                  <td>
                    <select
                      value={line.itemId}
                      disabled={!supplierSelected}
                      onChange={(event) => onChangeLineItem(line.clientId, event.target.value)}
                    >
                      <option value="">请选择商品</option>
                      {items.map((item) => (
                        <option key={item.id} value={item.id}>
                          {itemLabel(item)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className="cell-strong">{selectedItem?.name ?? "待选择商品"}</div>
                    <div className="cell-muted">
                      {selectedItem
                        ? `${selectedItem.sku}${selectedItem.spec ? ` / ${selectedItem.spec}` : ""}`
                        : "SKU / 规格选择商品后自动带出"}
                    </div>
                  </td>
                  <td>
                    <select
                      value={line.purchaseUomId}
                      disabled={!line.itemId || uoms.length === 0}
                      onChange={(event) =>
                        onChangeLine(line.clientId, "purchaseUomId", event.target.value)
                      }
                    >
                      <option value="">请选择单位</option>
                      {uoms.map((uom) => (
                        <option key={uom.id} value={uom.id}>
                          {uom.uom_name} × {uom.ratio_to_base}
                          {uom.is_purchase_default ? "（采购默认）" : ""}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      value={line.qtyOrderedInput}
                      inputMode="decimal"
                      placeholder="数量"
                      onChange={(event) =>
                        onChangeLine(line.clientId, "qtyOrderedInput", event.target.value)
                      }
                    />
                  </td>
                  <td>{lineBaseQty(line, uoms)}</td>
                  <td className="text-right">
                    <input
                      value={line.supplyPrice}
                      inputMode="decimal"
                      placeholder="0.00"
                      onChange={(event) =>
                        onChangeLine(line.clientId, "supplyPrice", event.target.value)
                      }
                    />
                  </td>
                  <td className="text-right">
                    <input
                      value={line.discountAmount}
                      inputMode="decimal"
                      placeholder="0.00"
                      onChange={(event) =>
                        onChangeLine(line.clientId, "discountAmount", event.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={line.remark}
                      placeholder="行备注"
                      onChange={(event) =>
                        onChangeLine(line.clientId, "remark", event.target.value)
                      }
                    />
                  </td>
                  <td className="text-right">{lineAmount(line, uoms)}</td>
                  <td>
                    <button
                      type="button"
                      className="button button-secondary"
                      disabled={lines.length <= 1}
                      onClick={() => onRemoveLine(line.clientId)}
                    >
                      删除
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
