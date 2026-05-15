// 拆分说明：从 PurchaseOrdersPage.tsx 抽出 WMS 收货同步结果展示，页面层只负责装配。

import type { WmsReceivingInboxSyncAndApplyOut } from "../../../../../domains/procurement/ops/wmsReceivingInboxOpsClient";

export function WmsReceivingSyncResultPanel({
  result,
}: {
  result: WmsReceivingInboxSyncAndApplyOut;
}) {
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
