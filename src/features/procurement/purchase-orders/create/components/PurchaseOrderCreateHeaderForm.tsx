import type {
  PurchaseOrderCreateHeaderDraft,
} from "../model/usePurchaseOrderCreateController";
import type { PmsReadSupplierOut } from "../../../../../domains/procurement/read/purchaseOrdersClient";

interface PurchaseOrderCreateHeaderFormProps {
  header: PurchaseOrderCreateHeaderDraft;
  suppliers: PmsReadSupplierOut[];
  loadingSuppliers: boolean;
  onChangeSupplier: (supplierId: string) => void;
  onChangeHeader: <K extends keyof PurchaseOrderCreateHeaderDraft>(
    key: K,
    value: PurchaseOrderCreateHeaderDraft[K],
  ) => void;
  onReloadSuppliers: () => void;
}

export function PurchaseOrderCreateHeaderForm({
  header,
  suppliers,
  loadingSuppliers,
  onChangeSupplier,
  onChangeHeader,
  onReloadSuppliers,
}: PurchaseOrderCreateHeaderFormProps) {
  return (
    <section className="page-card">
      <div className="table-header">
        <div>
          <h2>采购单头部信息</h2>
          <p className="cell-muted">
            供应商来自 procurement-api 的 PMS BFF；采购单 owner 后续只提交到 procurement-api。
          </p>
        </div>

        <button
          type="button"
          className="button button-secondary"
          disabled={loadingSuppliers}
          onClick={onReloadSuppliers}
        >
          {loadingSuppliers ? "刷新中…" : "刷新供应商"}
        </button>
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
          <span>目标仓库 ID</span>
          <input
            value={header.targetWarehouseId}
            placeholder="例如：1"
            inputMode="numeric"
            onChange={(event) => onChangeHeader("targetWarehouseId", event.target.value)}
          />
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
          当前前端不直连 PMS，也不调用 WMS 旧采购接口；目标仓库 ID 暂按采购创建合同提交。
        </div>
      </div>
    </section>
  );
}
