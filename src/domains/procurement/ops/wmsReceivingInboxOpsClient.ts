import { apiUrl } from "../../../lib/api";

export interface WmsReceivingInboxSyncOut {
  after_event_id: number;
  next_after_event_id: number;
  fetched_count: number;
  upserted_count: number;
  has_more: boolean;
}

export interface WmsReceivingInboxApplyOut {
  pending_count: number;
  applied_count: number;
  failed_count: number;
}

export interface WmsReceivingInboxSyncAndApplyOut {
  sync: WmsReceivingInboxSyncOut;
  apply: WmsReceivingInboxApplyOut;
}

export interface SyncAndApplyParams {
  after_event_id?: number;
  limit?: number;
  procurement_po_id?: number;
  receipt_no?: string;
  apply_limit?: number;
}

function buildQuery(params: SyncAndApplyParams): string {
  const search = new URLSearchParams();

  if (params.after_event_id != null) {
    search.set("after_event_id", String(params.after_event_id));
  }
  if (params.limit != null) {
    search.set("limit", String(params.limit));
  }
  if (params.procurement_po_id != null) {
    search.set("procurement_po_id", String(params.procurement_po_id));
  }
  if (params.receipt_no?.trim()) {
    search.set("receipt_no", params.receipt_no.trim());
  }
  if (params.apply_limit != null) {
    search.set("apply_limit", String(params.apply_limit));
  }

  const value = search.toString();
  return value ? `?${value}` : "";
}

export async function syncAndApplyWmsReceivingInbox(
  params: SyncAndApplyParams = {},
): Promise<WmsReceivingInboxSyncAndApplyOut> {
  const response = await fetch(
    apiUrl(`/procurement/ops/wms-receiving-inbox/sync-and-apply${buildQuery(params)}`),
    {
      method: "POST",
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`同步 WMS 收货结果失败：${response.status} ${body}`);
  }

  return (await response.json()) as WmsReceivingInboxSyncAndApplyOut;
}
