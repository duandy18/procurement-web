// 拆分说明：从 PurchaseOrdersPage.tsx 抽出采购列表工具条；页面层只负责装配。

import type { FormEvent } from "react";

import type { PurchaseOrdersFilters } from "../types";
import { ORDER_STATUS_OPTIONS } from "../utils";

interface PurchaseOrdersToolbarProps {
  filters: PurchaseOrdersFilters;
  loading: boolean;
  syncing: boolean;
  onChangeSearchText: (value: string) => void;
  onChangeStatus: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
  onRefresh: () => void;
  onOpenCreate: () => void;
  onSyncWmsReceiving: () => void;
}

export function PurchaseOrdersToolbar({
  filters,
  loading,
  syncing,
  onChangeSearchText,
  onChangeStatus,
  onSubmit,
  onReset,
  onRefresh,
  onOpenCreate,
  onSyncWmsReceiving,
}: PurchaseOrdersToolbarProps) {
  return (
    <div className="page-card">
      <div className="table-header">
        <div>
          <h2>采购计划完成情况</h2>
          <p className="cell-muted">
            采购单 owner 数据来自 procurement-api；WMS 收货结果通过同步动作回传完成状态。
          </p>
        </div>

        <div className="filter-actions">
          <button type="button" className="button button-secondary" onClick={onOpenCreate}>
            新建采购单
          </button>
          <button
            type="button"
            className="button button-secondary"
            disabled={loading}
            onClick={onRefresh}
          >
            {loading ? "刷新中…" : "刷新"}
          </button>
          <button
            type="button"
            className="button button-primary"
            disabled={syncing}
            onClick={onSyncWmsReceiving}
          >
            {syncing ? "同步中…" : "同步 WMS 收货结果"}
          </button>
        </div>
      </div>

      <form className="filter-bar" onSubmit={onSubmit}>
        <label>
          <span>关键词</span>
          <input
            value={filters.q}
            placeholder="采购单号 / 供应商 / 采购人"
            onChange={(event) => onChangeSearchText(event.target.value)}
          />
        </label>

        <label>
          <span>订单状态</span>
          <select value={filters.status} onChange={(event) => onChangeStatus(event.target.value)}>
            {ORDER_STATUS_OPTIONS.map((option) => (
              <option key={option.value || "ALL"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="filter-actions">
          <button type="submit" className="button button-primary">
            查询
          </button>
          <button type="button" className="button button-secondary" onClick={onReset}>
            重置
          </button>
        </div>
      </form>
    </div>
  );
}
