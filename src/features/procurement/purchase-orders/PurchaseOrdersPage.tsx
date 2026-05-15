import { useState } from "react";
import { Link } from "react-router-dom";

import PageTitle from "../../../components/ui/PageTitle";
import {
  type WmsReceivingInboxSyncAndApplyOut,
  syncAndApplyWmsReceivingInbox,
} from "../../../domains/procurement/ops/wmsReceivingInboxOpsClient";

function ResultPanel({ result }: { result: WmsReceivingInboxSyncAndApplyOut }) {
  return (
    <div className="page-card">
      <h2>WMS 收货同步结果</h2>
      <dl className="description-list">
        <div>
          <dt>同步读取</dt>
          <dd>
            fetched={result.sync.fetched_count} / upserted={result.sync.upserted_count}
          </dd>
        </div>
        <div>
          <dt>完成状态应用</dt>
          <dd>
            pending={result.apply.pending_count} / applied={result.apply.applied_count} /
            failed={result.apply.failed_count}
          </dd>
        </div>
        <div>
          <dt>next_after_event_id</dt>
          <dd>{result.sync.next_after_event_id}</dd>
        </div>
      </dl>
    </div>
  );
}

export default function PurchaseOrdersPage() {
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState("");
  const [syncResult, setSyncResult] = useState<WmsReceivingInboxSyncAndApplyOut | null>(null);

  async function handleSync() {
    setSyncing(true);
    setSyncError("");
    setSyncResult(null);

    try {
      const result = await syncAndApplyWmsReceivingInbox({
        after_event_id: 0,
        limit: 200,
        apply_limit: 500,
      });
      setSyncResult(result);
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : "同步 WMS 收货结果失败");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="page-stack">
      <PageTitle
        title="采购列表"
        description="采购系统 owner 数据列表。WMS 收货结果通过右侧按钮同步回采购完成状态。"
        actions={
          <>
            <Link className="button button-secondary" to="/procurement/purchase-orders/new">
              新建采购单
            </Link>
            <button
              type="button"
              className="button button-primary"
              disabled={syncing}
              onClick={() => {
                void handleSync();
              }}
            >
              {syncing ? "同步中…" : "同步 WMS 收货结果"}
            </button>
          </>
        }
      />

      {syncError ? <div className="alert alert-error">{syncError}</div> : null}
      {syncResult ? <ResultPanel result={syncResult} /> : null}

      <div className="page-card">
        <h2>采购订单</h2>
        <p>
          下一刀接入 procurement-api 的采购列表合同。当前页面先完成 WMS 风格页面壳和 WMS
          收货同步入口。
        </p>
      </div>
    </div>
  );
}
