// 拆分说明：从 PurchaseOrderDetailPage.tsx 抽出详情页纯函数，页面层只负责装配。

export function formatDateTime(value: string | null): string {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatAmount(value: string | null): string {
  if (!value) return "0.00";

  const amount = Number(value);
  if (!Number.isFinite(amount)) return value;

  return amount.toFixed(2);
}

export function statusLabel(value: string): string {
  const labels: Record<string, string> = {
    CREATED: "已创建",
    CLOSED: "已关闭",
    CANCELED: "已取消",
  };

  return labels[value] ?? value;
}

export function completionLabel(value: string): string {
  const labels: Record<string, string> = {
    NOT_RECEIVED: "未收货",
    PARTIAL: "部分收货",
    RECEIVED: "已收货",
  };

  return labels[value] ?? value;
}

export function completionClass(value: string): string {
  if (value === "RECEIVED") return "status-pill status-success";
  if (value === "PARTIAL") return "status-pill status-warning";
  return "status-pill status-muted";
}
