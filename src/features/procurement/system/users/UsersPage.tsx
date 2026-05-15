import PageTitle from "../../../../components/ui/PageTitle";

export default function UsersPage() {
  return (
    <div className="page-stack">
      <PageTitle
        title="用户管理"
        description="采购系统用户与权限管理入口。后续接入 procurement-api 用户/角色合同。"
      />

      <div className="page-card">
        <h2>用户管理</h2>
        <p>当前先完成页面注册和前端入口，暂不迁 WMS 用户权限矩阵。</p>
      </div>
    </div>
  );
}
