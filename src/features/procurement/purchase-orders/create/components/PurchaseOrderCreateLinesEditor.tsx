const skeletonRows = [1, 2, 3];

export function PurchaseOrderCreateLinesEditor() {
  return (
    <section className="page-card">
      <div className="table-header">
        <div>
          <h2>采购行明细</h2>
          <p className="cell-muted">
            行输入负责采购计划数量和商业字段。PMS 商品/单位查询后续通过 procurement-api HTTP
            读取，不做前端直连 PMS。
          </p>
        </div>

        <button type="button" className="button button-secondary" disabled>
          + 添加一行
        </button>
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
              <th className="text-right">采购单价</th>
              <th className="text-right">折扣金额</th>
              <th>行备注</th>
              <th className="text-right">行金额</th>
              <th>操作</th>
            </tr>
          </thead>

          <tbody>
            {skeletonRows.map((rowNo) => (
              <tr key={rowNo}>
                <td>{rowNo}</td>
                <td>
                  <select disabled>
                    <option>后续选择 PMS 商品</option>
                  </select>
                </td>
                <td>
                  <div className="cell-strong">待选择商品</div>
                  <div className="cell-muted">SKU / 规格 / 条码后续自动带出</div>
                </td>
                <td>
                  <select disabled>
                    <option>先选商品</option>
                  </select>
                </td>
                <td>
                  <input disabled placeholder="数量" />
                </td>
                <td>-</td>
                <td className="text-right">
                  <input disabled placeholder="单价" />
                </td>
                <td className="text-right">
                  <input disabled placeholder="折扣" />
                </td>
                <td>
                  <input disabled placeholder="行备注" />
                </td>
                <td className="text-right">-</td>
                <td>
                  <button type="button" className="button button-secondary" disabled>
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
