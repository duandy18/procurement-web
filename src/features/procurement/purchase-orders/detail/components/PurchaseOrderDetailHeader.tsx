// 拆分说明：从 PurchaseOrderDetailPage.tsx 抽出详情页头部，页面层只负责装配。

import { Link } from "react-router-dom";

import PageTitle from "../../../../../components/ui/PageTitle";
import type { PurchaseOrderOut } from "../../../../../domains/procurement/read/purchaseOrdersClient";

export function PurchaseOrderDetailHeader({ order }: { order: PurchaseOrderOut | null }) {
  return (
    <PageTitle
      title={order ? `采购单详情 · ${order.po_no}` : "采购单详情"}
      description="采购单 owner 数据来自 procurement-api；WMS 只回传收货执行结果。"
      actions={
        <Link className="button button-secondary" to="/procurement/purchase-orders">
          返回采购列表
        </Link>
      }
    />
  );
}
