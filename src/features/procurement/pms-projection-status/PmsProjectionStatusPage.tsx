import { useEffect, useState } from "react";

import {
  type ProcurementReadStatus,
  fetchProcurementReadStatus,
} from "../../../domains/procurement/read/statusClient";
import { pmsProjectionBoundary } from "../../../domains/pms/projection/contract";

type LoadState =
  | {
      state: "loading";
    }
  | {
      state: "success";
      data: ProcurementReadStatus;
    }
  | {
      state: "error";
      message: string;
    };

export default function PmsProjectionStatusPage() {
  const [loadState, setLoadState] = useState<LoadState>({ state: "loading" });

  useEffect(() => {
    let isMounted = true;

    fetchProcurementReadStatus()
      .then((data) => {
        if (isMounted) {
          setLoadState({ state: "success", data });
        }
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "未知错误";

        if (isMounted) {
          setLoadState({ state: "error", message });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="page-stack">
      <div className="page-card">
        <p className="eyebrow">PMS Projection</p>
        <h1>PMS 投影状态</h1>
        <p>
          当前页面用于固定采购系统读取 PMS 商品资料的边界：只能通过 read API / projection 合同，
          不能直接 JOIN PMS owner 表。
        </p>
      </div>

      <div className="page-card">
        <h2>边界合同</h2>
        <dl className="description-list">
          <div>
            <dt>sourceSystem</dt>
            <dd>{pmsProjectionBoundary.sourceSystem}</dd>
          </div>
          <div>
            <dt>consumerSystem</dt>
            <dd>{pmsProjectionBoundary.consumerSystem}</dd>
          </div>
          <div>
            <dt>rule</dt>
            <dd>{pmsProjectionBoundary.rule}</dd>
          </div>
        </dl>
      </div>

      <div className="page-card">
        <h2>procurement-api read status</h2>
        {loadState.state === "loading" ? <p>读取中...</p> : null}
        {loadState.state === "error" ? <p className="error-text">{loadState.message}</p> : null}
        {loadState.state === "success" ? (
          <dl className="description-list">
            <div>
              <dt>status</dt>
              <dd>{loadState.data.status}</dd>
            </div>
            <div>
              <dt>service</dt>
              <dd>{loadState.data.service}</dd>
            </div>
            <div>
              <dt>contract</dt>
              <dd>{loadState.data.contract}</dd>
            </div>
          </dl>
        ) : null}
      </div>
    </div>
  );
}
