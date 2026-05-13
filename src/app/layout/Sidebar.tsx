import { NavLink } from "react-router-dom";

interface NavItem {
  to: string;
  label: string;
  description: string;
}

const navItems: NavItem[] = [
  {
    to: "/procurement",
    label: "采购工作台",
    description: "采购域总览",
  },
  {
    to: "/procurement/purchase-orders",
    label: "采购订单",
    description: "采购 owner 数据",
  },
  {
    to: "/procurement/purchase-reports",
    label: "采购报表",
    description: "采购分析入口",
  },
  {
    to: "/procurement/pms-projection-status",
    label: "PMS 投影状态",
    description: "商品资料读取边界",
  },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-mark">P</span>
        <div>
          <strong>Procurement</strong>
          <small>独立采购系统</small>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/procurement"}
            className={({ isActive }) => (isActive ? "nav-item nav-item-active" : "nav-item")}
          >
            <span>{item.label}</span>
            <small>{item.description}</small>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
