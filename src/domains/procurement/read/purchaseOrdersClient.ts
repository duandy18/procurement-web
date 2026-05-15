import { apiUrl } from "../../../lib/api";

export type PurchaseOrderStatus = "CREATED" | "CLOSED" | "CANCELED";
export type PurchaseOrderCompletionStatus = "NOT_RECEIVED" | "PARTIAL" | "RECEIVED";

export interface PurchaseOrderOut {
  id: number;
  po_no: string;

  supplier_id: number;
  supplier_code_snapshot: string;
  supplier_name_snapshot: string;

  target_warehouse_id: number;
  target_warehouse_code_snapshot: string | null;
  target_warehouse_name_snapshot: string | null;

  purchaser: string;
  purchase_time: string;

  status: PurchaseOrderStatus;
  total_amount: string;
  remark: string | null;

  created_at: string;
  updated_at: string;
  closed_at: string | null;
  canceled_at: string | null;

  editable: boolean;
  edit_block_reason: string | null;

  total_ordered_base: number;
  total_received_base: number;
  total_remaining_base: number;
  completion_status: PurchaseOrderCompletionStatus;
  last_received_at: string | null;
}

export interface PurchaseOrderListParams {
  skip?: number;
  limit?: number;
  supplier_id?: number;
  status?: string;
  q?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
}

function asNullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function asNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function asBoolean(value: unknown): boolean {
  return typeof value === "boolean" ? value : false;
}

function parseStatus(value: unknown): PurchaseOrderStatus {
  return value === "CLOSED" || value === "CANCELED" ? value : "CREATED";
}

function parseCompletionStatus(value: unknown): PurchaseOrderCompletionStatus {
  if (value === "PARTIAL" || value === "RECEIVED") return value;
  return "NOT_RECEIVED";
}

function buildQuery(params: PurchaseOrderListParams): string {
  const search = new URLSearchParams();

  if (params.skip != null) search.set("skip", String(params.skip));
  if (params.limit != null) search.set("limit", String(params.limit));
  if (params.supplier_id != null) search.set("supplier_id", String(params.supplier_id));
  if (params.status?.trim()) search.set("status", params.status.trim());
  if (params.q?.trim()) search.set("q", params.q.trim());

  const value = search.toString();
  return value ? `?${value}` : "";
}

function parsePurchaseOrder(value: unknown): PurchaseOrderOut | null {
  if (!isRecord(value)) return null;

  const id = asNumber(value.id);
  const poNo = asString(value.po_no).trim();

  if (id <= 0 || !poNo) return null;

  return {
    id,
    po_no: poNo,

    supplier_id: asNumber(value.supplier_id),
    supplier_code_snapshot: asString(value.supplier_code_snapshot),
    supplier_name_snapshot: asString(value.supplier_name_snapshot),

    target_warehouse_id: asNumber(value.target_warehouse_id),
    target_warehouse_code_snapshot: asNullableString(value.target_warehouse_code_snapshot),
    target_warehouse_name_snapshot: asNullableString(value.target_warehouse_name_snapshot),

    purchaser: asString(value.purchaser),
    purchase_time: asString(value.purchase_time),

    status: parseStatus(value.status),
    total_amount: asString(value.total_amount),
    remark: asNullableString(value.remark),

    created_at: asString(value.created_at),
    updated_at: asString(value.updated_at),
    closed_at: asNullableString(value.closed_at),
    canceled_at: asNullableString(value.canceled_at),

    editable: asBoolean(value.editable),
    edit_block_reason: asNullableString(value.edit_block_reason),

    total_ordered_base: asNumber(value.total_ordered_base),
    total_received_base: asNumber(value.total_received_base),
    total_remaining_base: asNumber(value.total_remaining_base),
    completion_status: parseCompletionStatus(value.completion_status),
    last_received_at: asNullableString(value.last_received_at),
  };
}

export async function fetchPurchaseOrders(
  params: PurchaseOrderListParams = {},
): Promise<PurchaseOrderOut[]> {
  const response = await fetch(
    apiUrl(`/procurement/read/v1/purchase-orders${buildQuery(params)}`),
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`加载采购列表失败：${response.status} ${body}`);
  }

  const payload: unknown = await response.json();

  if (!Array.isArray(payload)) {
    throw new Error("采购列表响应格式错误");
  }

  return payload
    .map(parsePurchaseOrder)
    .filter((item): item is PurchaseOrderOut => item !== null);
}
