import PageTitle from "../../../../components/ui/PageTitle";
import { UsersPanel } from "./components/UsersPanel";
import { useUsersPresenter } from "./hooks/useUsersPresenter";

export default function UsersPage() {
  const presenter = useUsersPresenter();

  return (
    <div className="page-stack">
      <PageTitle title="用户管理" description="采购系统用户、状态与一级页面权限矩阵管理。" />
      <UsersPanel presenter={presenter} />
    </div>
  );
}
