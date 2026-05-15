export function PurchaseOrderCreateHeaderForm() {
  return (
    <section className="page-card">
      <div className="table-header">
        <div>
          <h2>采购单头部信息</h2>
          <p className="cell-muted">
            当前先搭建 UI 骨架。后续供应商、仓库、采购人、采购时间会接入 procurement-api 合同。
          </p>
        </div>
      </div>

      <div className="filter-bar">
        <label>
          <span>供应商</span>
          <select disabled>
            <option>后续接入供应商查询</option>
          </select>
        </label>

        <label>
          <span>目标仓库</span>
          <select disabled>
            <option>后续接入仓库选择</option>
          </select>
        </label>

        <label>
          <span>采购人</span>
          <input disabled placeholder="后续填写采购人" />
        </label>
      </div>

      <div className="filter-bar">
        <label>
          <span>采购时间</span>
          <input disabled type="datetime-local" />
        </label>

        <label>
          <span>备注</span>
          <input disabled placeholder="后续填写采购备注" />
        </label>

        <div className="alert">
          新建采购单 owner 数据只会提交到 procurement-api，不调用 WMS 旧采购接口。
        </div>
      </div>
    </section>
  );
}
