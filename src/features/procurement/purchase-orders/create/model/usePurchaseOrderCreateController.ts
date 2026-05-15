import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  type PmsReadItemBasicOut,
  type PmsReadSupplierOut,
  type PmsReadUomOut,
  type WmsReadWarehouseOut,
  createPurchaseOrder,
  fetchPmsItemBasics,
  fetchPmsItemUoms,
  fetchPmsSuppliers,
  fetchWmsWarehouses,
} from "../../../../../domains/procurement/read/purchaseOrdersClient";

export interface PurchaseOrderCreateHeaderDraft {
  supplierId: string;
  targetWarehouseId: string;
  purchaser: string;
  purchaseTime: string;
  remark: string;
}

export interface PurchaseOrderCreateLineDraft {
  clientId: string;
  itemId: string;
  purchaseUomId: string;
  qtyOrderedInput: string;
  supplyPrice: string;
  discountAmount: string;
  remark: string;
}

function createClientId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function nowForDatetimeLocal(): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

function newLine(): PurchaseOrderCreateLineDraft {
  return {
    clientId: createClientId(),
    itemId: "",
    purchaseUomId: "",
    qtyOrderedInput: "1",
    supplyPrice: "",
    discountAmount: "",
    remark: "",
  };
}

function positiveNumber(value: string): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function optionalMoney(value: string): string | null {
  const normalized = value.trim();
  return normalized ? normalized : null;
}

function toIsoDatetime(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("采购时间无效");
  }
  return parsed.toISOString();
}

function pickDefaultUom(uoms: PmsReadUomOut[]): PmsReadUomOut | null {
  return (
    uoms.find((item) => item.is_purchase_default) ??
    uoms.find((item) => item.is_base) ??
    uoms[0] ??
    null
  );
}

export function lineBaseQty(line: PurchaseOrderCreateLineDraft, uoms: PmsReadUomOut[]): string {
  const qty = Number(line.qtyOrderedInput);
  const uom = uoms.find((item) => String(item.id) === line.purchaseUomId);

  if (!Number.isFinite(qty) || qty <= 0 || !uom) return "-";

  return String(qty * uom.ratio_to_base);
}

export function lineAmount(line: PurchaseOrderCreateLineDraft, uoms: PmsReadUomOut[]): string {
  const qty = Number(line.qtyOrderedInput);
  const price = Number(line.supplyPrice || "0");
  const discount = Number(line.discountAmount || "0");
  const uom = uoms.find((item) => String(item.id) === line.purchaseUomId);

  if (!Number.isFinite(qty) || qty <= 0 || !uom) return "-";
  if (!Number.isFinite(price) || price < 0) return "-";
  if (!Number.isFinite(discount) || discount < 0) return "-";

  return Math.max(qty * uom.ratio_to_base * price - discount, 0).toFixed(2);
}

export function usePurchaseOrderCreateController() {
  const navigate = useNavigate();

  const [header, setHeader] = useState<PurchaseOrderCreateHeaderDraft>({
    supplierId: "",
    targetWarehouseId: "",
    purchaser: "Andy",
    purchaseTime: nowForDatetimeLocal(),
    remark: "",
  });

  const [lines, setLines] = useState<PurchaseOrderCreateLineDraft[]>([newLine()]);
  const [suppliers, setSuppliers] = useState<PmsReadSupplierOut[]>([]);
  const [warehouses, setWarehouses] = useState<WmsReadWarehouseOut[]>([]);
  const [items, setItems] = useState<PmsReadItemBasicOut[]>([]);
  const [uomsByLineId, setUomsByLineId] = useState<Record<string, PmsReadUomOut[]>>({});
  const [itemKeyword, setItemKeyword] = useState("");
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const selectedSupplierId = useMemo(() => positiveNumber(header.supplierId), [header.supplierId]);

  const loadSuppliers = useCallback(async () => {
    setLoadingSuppliers(true);
    setError("");

    try {
      setSuppliers(await fetchPmsSuppliers({ active: true, limit: 200 }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载供应商失败");
    } finally {
      setLoadingSuppliers(false);
    }
  }, []);

  const loadWarehouses = useCallback(async () => {
    setLoadingWarehouses(true);
    setError("");

    try {
      const nextWarehouses = await fetchWmsWarehouses({ active: true, limit: 200 });
      setWarehouses(nextWarehouses);

      setHeader((prev) => {
        if (prev.targetWarehouseId || nextWarehouses.length === 0) {
          return prev;
        }

        return {
          ...prev,
          targetWarehouseId: String(nextWarehouses[0].id),
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载目标仓库失败");
    } finally {
      setLoadingWarehouses(false);
    }
  }, []);

  const loadItems = useCallback(async () => {
    if (!selectedSupplierId) {
      setItems([]);
      return;
    }

    setLoadingItems(true);
    setError("");

    try {
      setItems(
        await fetchPmsItemBasics({
          supplier_id: selectedSupplierId,
          q: itemKeyword,
          enabled: true,
          limit: 200,
        }),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载商品失败");
    } finally {
      setLoadingItems(false);
    }
  }, [itemKeyword, selectedSupplierId]);

  useEffect(() => {
    void loadSuppliers();
  }, [loadSuppliers]);

  useEffect(() => {
    void loadWarehouses();
  }, [loadWarehouses]);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  function updateHeader<K extends keyof PurchaseOrderCreateHeaderDraft>(
    key: K,
    value: PurchaseOrderCreateHeaderDraft[K],
  ) {
    setHeader((prev) => ({ ...prev, [key]: value }));
    setMessage("");
  }

  function changeSupplier(supplierId: string) {
    setHeader((prev) => ({ ...prev, supplierId }));
    setItems([]);
    setUomsByLineId({});
    setLines([newLine()]);
    setMessage("");
  }

  function updateLine<K extends keyof PurchaseOrderCreateLineDraft>(
    clientId: string,
    key: K,
    value: PurchaseOrderCreateLineDraft[K],
  ) {
    setLines((prev) =>
      prev.map((line) => (line.clientId === clientId ? { ...line, [key]: value } : line)),
    );
    setMessage("");
  }

  async function changeLineItem(clientId: string, itemId: string) {
    updateLine(clientId, "itemId", itemId);
    updateLine(clientId, "purchaseUomId", "");

    const parsedItemId = positiveNumber(itemId);
    if (!parsedItemId) {
      setUomsByLineId((prev) => ({ ...prev, [clientId]: [] }));
      return;
    }

    setError("");

    try {
      const uoms = await fetchPmsItemUoms(parsedItemId);
      const defaultUom = pickDefaultUom(uoms);

      setUomsByLineId((prev) => ({ ...prev, [clientId]: uoms }));
      if (defaultUom) {
        updateLine(clientId, "purchaseUomId", String(defaultUom.id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载商品单位失败");
    }
  }

  function addLine() {
    setLines((prev) => [...prev, newLine()]);
  }

  function removeLine(clientId: string) {
    setLines((prev) => (prev.length <= 1 ? prev : prev.filter((line) => line.clientId !== clientId)));
    setUomsByLineId((prev) => {
      const next = { ...prev };
      delete next[clientId];
      return next;
    });
  }

  async function submit() {
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const supplierId = positiveNumber(header.supplierId);
      const targetWarehouseId = positiveNumber(header.targetWarehouseId);

      if (!supplierId) throw new Error("请选择供应商");
      if (!targetWarehouseId) throw new Error("请选择目标仓库");
      if (!header.purchaser.trim()) throw new Error("采购人不能为空");

      const payloadLines = lines.map((line, index) => {
        const itemId = positiveNumber(line.itemId);
        const purchaseUomId = positiveNumber(line.purchaseUomId);

        if (!itemId) throw new Error(`第 ${index + 1} 行请选择商品`);
        if (!purchaseUomId) throw new Error(`第 ${index + 1} 行请选择采购单位`);
        if (!positiveNumber(line.qtyOrderedInput)) throw new Error(`第 ${index + 1} 行数量必须大于 0`);

        return {
          line_no: index + 1,
          item_id: itemId,
          purchase_uom_id: purchaseUomId,
          qty_ordered_input: line.qtyOrderedInput,
          supply_price: optionalMoney(line.supplyPrice),
          discount_amount: optionalMoney(line.discountAmount),
          remark: line.remark.trim() || null,
        };
      });

      const created = await createPurchaseOrder({
        supplier_id: supplierId,
        target_warehouse_id: targetWarehouseId,
        purchaser: header.purchaser.trim(),
        purchase_time: toIsoDatetime(header.purchaseTime),
        remark: header.remark.trim() || null,
        lines: payloadLines,
      });

      setMessage(`采购单创建成功：${created.po_no}`);
      navigate(`/procurement/purchase-orders/${created.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "创建采购单失败");
    } finally {
      setSubmitting(false);
    }
  }

  return {
    header,
    lines,
    suppliers,
    warehouses,
    items,
    uomsByLineId,
    itemKeyword,
    loadingSuppliers,
    loadingWarehouses,
    loadingItems,
    submitting,
    message,
    error,
    setItemKeyword,
    updateHeader,
    changeSupplier,
    updateLine,
    changeLineItem,
    addLine,
    removeLine,
    loadSuppliers,
    loadWarehouses,
    loadItems,
    submit,
  };
}
