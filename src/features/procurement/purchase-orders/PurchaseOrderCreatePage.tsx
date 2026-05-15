import PageTitle from "../../../components/ui/PageTitle";

export default function PurchaseOrderCreatePage() {
  return (
    <div className="page-stack">
      <PageTitle
        title="新建采购单"
        description="后续在本页接入 PMS 商品/供应商 HTTP 查询，并提交 procurement-api 采购 owner 合同。"
      />

      <div className="page-card">
        <h2>新建采购单表单</h2>
        <p>当前先注册页面和 WMS 风格外壳，避免把 WMS 旧采购页面逻辑带回采购系统。</p>
      </div>
    </div>
  );
}
