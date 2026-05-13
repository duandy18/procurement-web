const boundaryCards = [
  {
    title: "采购 owner",
    body: "采购系统负责采购订单、采购订单行、采购报表等采购域事实。",
  },
  {
    title: "PMS 资料读取",
    body: "采购系统通过 PMS read API / projection 读取商品、SKU、包装、条码和供应商资料。",
  },
  {
    title: "WMS 执行边界",
    body: "WMS 只负责采购入库单、收货、上架和库存流水，不再拥有采购订单事实。",
  },
];

export default function ProcurementDashboardPage() {
  return (
    <div className="page-stack">
      <div className="page-hero">
        <p className="eyebrow">Procurement</p>
        <h1>采购独立化工作台</h1>
        <p>
          当前第一刀只建立独立前端骨架。后续再迁采购 owner 合同、PMS 投影读取和 WMS 入库
          handoff。
        </p>
      </div>

      <div className="card-grid">
        {boundaryCards.map((card) => (
          <article className="page-card" key={card.title}>
            <h2>{card.title}</h2>
            <p>{card.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
