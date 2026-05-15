import type {
  PmsReadSupplierOut,
  WmsReadWarehouseOut,
} from "../../../../../domains/procurement/read/purchaseOrdersClient";
import type {
  PurchaseOrderCreateHeaderDraft,
} from "../model/usePurchaseOrderCreateController";

interface PurchaseOrderCreateHeaderFormProps {
  header: PurchaseOrderCreateHeaderDraft;
  suppliers: PmsReadSupplierOut[];
  warehouses: WmsReadWarehouseOut[];
  loadingSuppliers: boolean;
  loadingWarehouses: boolean;
  onChangeSupplier: (supplierId: string) => void;
  onChangeHeader: <K extends keyof PurchaseOrderCreateHeaderDraft>(
    key: K,
    value: PurchaseOrderCreateHeaderDraft[K],
  ) => void;
  onReloadSuppliers: () => void;
  onReloadWarehouses: () => void;
}

export function PurchaseOrderCreateHeaderForm({
  header,
  suppliers,
  warehouses,
  loadingSuppliers,
  loadingWarehouses,
  onChangeSupplier,
  onChangeHeader,
  onReloadSuppliers,
  onReloadWarehouses,
}: PurchaseOrderCreateHeaderFormProps) {
  return (
    <section className="page-card">
      <div className="table-header">
        <div>
          <h2>采购单头部信息</h2>
          <p className="cell-muted">
            供应商来自 procurement-api 的 PMS BFF；目标仓库来自 procurement-api 的 WMS BFF。
          </p>
        </div>

        <div className="filter-actions">
          <button
            type="button"
            className="button button-secondary"
            disabled={loadingSuppliers}
            onClick={onReloadSuppliers}
          >
            {loadingSuppliers ? "刷新中…" : "刷新供应商"}
          </button>
          <button
            type="button"
            className="button button-secondary"
            disabled={loadingWarehouses}
            onClick={onReloadWarehouses}
          >
            {loadingWarehouses ? "刷新中…" : "刷新仓库"}
          </button>
        </div>
      </div>

      <div className="filter-bar">
        <label>
          <span>供应商</span>
          <select
            value={header.supplierId}
            onChange={(event) => onChangeSupplier(event.target.value)}
          >
            <option value="">请选择供应商</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}（{supplier.code ?? `#${supplier.id}`}）
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>目标仓库</span>
          <select
            value={header.targetWarehouseId}
            disabled={loadingWarehouses && warehouses.length === 0}
            onChange={(event) => onChangeHeader("targetWarehouseId", event.target.value)}
          >
            <option value="">请选择目标仓库</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}（{warehouse.code ?? `#${warehouse.id}`}）
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>采购人</span>
          <input
            value={header.purchaser}
            placeholder="填写采购人"
            onChange={(event) => onChangeHeader("purchaser", event.target.value)}
          />
        </label>
      </div>

      <div className="filter-bar">
        <label>
          <span>采购时间</span>
          <input
            value={header.purchaseTime}
            type="datetime-local"
            onChange={(event) => onChangeHeader("purchaseTime", event.target.value)}
          />
        </label>

        <label>
          <span>备注</span>
          <input
            value={header.remark}
            placeholder="采购备注"
            onChange={(event) => onChangeHeader("remark", event.target.value)}
          />
        </label>

        <div className="alert">
          当前前端不直连 PMS / WMS；供应商、商品、单位、仓库均通过 procurement-api BFF 读取。
        </div>
      </div>
    </section>
  );
}
