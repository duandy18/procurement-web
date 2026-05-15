import { apiUrl } from "../../../lib/api";

export type PurchaseOrderStatus = "CREATED" | "CLOSED" | "CANCELED";
export type PurchaseOrderCompletionStatus = "NOT_RECEIVED" | "PARTIAL" | "RECEIVED";

export interface PurchaseOrderLineOut {
  id: number;
  po_id: number;
  line_no: number;

  item_id: number;
  item_sku_snapshot: string | null;
  item_name_snapshot: string;
  spec_text_snapshot: string | null;

  purchase_uom_id_snapshot: number;
  purchase_uom_name_snapshot: string;
  purchase_ratio_to_base_snapshot: number;

  qty_ordered_input: string;
  qty_ordered_base: number;

  supply_price: string | null;
  discount_amount: string | null;
  line_amount: string;
  remark: string | null;

  created_at: string;
  updated_at: string;
}

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

  lines: PurchaseOrderLineOut[];
}

export interface PurchaseOrderListParams {
  skip?: number;
  limit?: number;
  supplier_id?: number;
  status?: string;
  q?: string;
}

export interface PmsReadSupplierOut {
  id: number;
  name: string;
  code: string | null;
  active: boolean;
  website: string | null;
}

export interface PmsReadItemBasicOut {
  id: number;
  sku: string;
  name: string;
  spec: string | null;
  enabled: boolean;
  supplier_id: number | null;
  brand: string | null;
  category: string | null;
}

export interface PmsReadUomOut {
  id: number;
  item_id: number;
  uom: string;
  display_name: string | null;
  uom_name: string;
  ratio_to_base: number;
  net_weight_kg: number | null;
  is_base: boolean;
  is_purchase_default: boolean;
  is_inbound_default: boolean;
  is_outbound_default: boolean;
}

export interface PurchaseOrderCreateLineIn {
  line_no: number;
  item_id: number;
  purchase_uom_id: number;
  qty_ordered_input: string;
  supply_price?: string | null;
  discount_amount?: string | null;
  remark?: string | null;
}

export interface PurchaseOrderCreateIn {
  supplier_id: number;
  target_warehouse_id: number;
  purchaser: string;
  purchase_time: string;
  remark?: string | null;
  lines: PurchaseOrderCreateLineIn[];
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
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return null;
}

function asNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function asNullableNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
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

function buildQuery(params: object): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) continue;
    if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") {
      continue;
    }

    const stringValue = String(value).trim();
    if (!stringValue) continue;
    search.set(key, stringValue);
  }

  const value = search.toString();
  return value ? `?${value}` : "";
}

function parseLine(value: unknown): PurchaseOrderLineOut | null {
  if (!isRecord(value)) return null;

  const id = asNumber(value.id);
  const poId = asNumber(value.po_id);
  const lineNo = asNumber(value.line_no);

  if (id <= 0 || poId <= 0 || lineNo <= 0) return null;

  return {
    id,
    po_id: poId,
    line_no: lineNo,

    item_id: asNumber(value.item_id),
    item_sku_snapshot: asNullableString(value.item_sku_snapshot),
    item_name_snapshot: asString(value.item_name_snapshot),
    spec_text_snapshot: asNullableString(value.spec_text_snapshot),

    purchase_uom_id_snapshot: asNumber(value.purchase_uom_id_snapshot),
    purchase_uom_name_snapshot: asString(value.purchase_uom_name_snapshot),
    purchase_ratio_to_base_snapshot: asNumber(value.purchase_ratio_to_base_snapshot),

    qty_ordered_input: asString(value.qty_ordered_input),
    qty_ordered_base: asNumber(value.qty_ordered_base),

    supply_price: asNullableString(value.supply_price),
    discount_amount: asNullableString(value.discount_amount),
    line_amount: asString(value.line_amount),
    remark: asNullableString(value.remark),

    created_at: asString(value.created_at),
    updated_at: asString(value.updated_at),
  };
}

function parsePurchaseOrder(value: unknown): PurchaseOrderOut | null {
  if (!isRecord(value)) return null;

  const id = asNumber(value.id);
  const poNo = asString(value.po_no).trim();

  if (id <= 0 || !poNo) return null;

  const lines = Array.isArray(value.lines)
    ? value.lines.map(parseLine).filter((item): item is PurchaseOrderLineOut => item !== null)
    : [];

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

    lines,
  };
}

function parseSupplier(value: unknown): PmsReadSupplierOut | null {
  if (!isRecord(value)) return null;

  const id = asNumber(value.id);
  const name = asString(value.name).trim();

  if (id <= 0 || !name) return null;

  return {
    id,
    name,
    code: asNullableString(value.code),
    active: asBoolean(value.active),
    website: asNullableString(value.website),
  };
}

function parseItemBasic(value: unknown): PmsReadItemBasicOut | null {
  if (!isRecord(value)) return null;

  const id = asNumber(value.id);
  const sku = asString(value.sku).trim();
  const name = asString(value.name).trim();

  if (id <= 0 || !sku || !name) return null;

  return {
    id,
    sku,
    name,
    spec: asNullableString(value.spec),
    enabled: asBoolean(value.enabled),
    supplier_id: asNullableNumber(value.supplier_id),
    brand: asNullableString(value.brand),
    category: asNullableString(value.category),
  };
}

function parseUom(value: unknown): PmsReadUomOut | null {
  if (!isRecord(value)) return null;

  const id = asNumber(value.id);
  const itemId = asNumber(value.item_id);
  const uomName = asString(value.uom_name).trim();

  if (id <= 0 || itemId <= 0 || !uomName) return null;

  return {
    id,
    item_id: itemId,
    uom: asString(value.uom),
    display_name: asNullableString(value.display_name),
    uom_name: uomName,
    ratio_to_base: asNumber(value.ratio_to_base),
    net_weight_kg: asNullableNumber(value.net_weight_kg),
    is_base: asBoolean(value.is_base),
    is_purchase_default: asBoolean(value.is_purchase_default),
    is_inbound_default: asBoolean(value.is_inbound_default),
    is_outbound_default: asBoolean(value.is_outbound_default),
  };
}

async function readJsonArray(response: Response, message: string): Promise<unknown[]> {
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${message}：${response.status} ${body}`);
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error(`${message}响应格式错误`);
  }

  return payload;
}

export async function fetchPurchaseOrders(
  params: PurchaseOrderListParams = {},
): Promise<PurchaseOrderOut[]> {
  const payload = await readJsonArray(
    await fetch(apiUrl(`/procurement/read/v1/purchase-orders${buildQuery(params)}`)),
    "加载采购列表失败",
  );

  return payload
    .map(parsePurchaseOrder)
    .filter((item): item is PurchaseOrderOut => item !== null);
}

export async function fetchPurchaseOrder(poId: number): Promise<PurchaseOrderOut> {
  const response = await fetch(apiUrl(`/procurement/read/v1/purchase-orders/${poId}`));

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`加载采购单详情失败：${response.status} ${body}`);
  }

  const payload: unknown = await response.json();
  const parsed = parsePurchaseOrder(payload);

  if (!parsed) {
    throw new Error("采购单详情响应格式错误");
  }

  return parsed;
}

export async function fetchPmsSuppliers(params: {
  active?: boolean | null;
  q?: string;
  limit?: number;
}): Promise<PmsReadSupplierOut[]> {
  const payload = await readJsonArray(
    await fetch(
      apiUrl(
        `/procurement/read/v1/pms/suppliers${buildQuery({
          active: params.active ?? true,
          q: params.q,
          limit: params.limit ?? 50,
        })}`,
      ),
    ),
    "加载供应商失败",
  );

  return payload.map(parseSupplier).filter((item): item is PmsReadSupplierOut => item !== null);
}

export async function fetchPmsItemBasics(params: {
  supplier_id?: number | null;
  q?: string;
  enabled?: boolean | null;
  limit?: number;
}): Promise<PmsReadItemBasicOut[]> {
  const payload = await readJsonArray(
    await fetch(
      apiUrl(
        `/procurement/read/v1/pms/items/basic${buildQuery({
          supplier_id: params.supplier_id,
          q: params.q,
          enabled: params.enabled ?? true,
          limit: params.limit ?? 50,
        })}`,
      ),
    ),
    "加载商品失败",
  );

  return payload.map(parseItemBasic).filter((item): item is PmsReadItemBasicOut => item !== null);
}

export async function fetchPmsItemUoms(itemId: number): Promise<PmsReadUomOut[]> {
  const payload = await readJsonArray(
    await fetch(apiUrl(`/procurement/read/v1/pms/items/${itemId}/uoms`)),
    "加载商品单位失败",
  );

  return payload.map(parseUom).filter((item): item is PmsReadUomOut => item !== null);
}

export async function createPurchaseOrder(payload: PurchaseOrderCreateIn): Promise<PurchaseOrderOut> {
  const response = await fetch(apiUrl("/procurement/write/v1/purchase-orders"), {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`创建采购单失败：${response.status} ${body}`);
  }

  const responsePayload: unknown = await response.json();
  const parsed = parsePurchaseOrder(responsePayload);

  if (!parsed) {
    throw new Error("创建采购单响应格式错误");
  }

  return parsed;
}
