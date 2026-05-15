import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import {
  buildNavigationChain,
  fetchProcurementNavigation,
  findNavigationPageByPath,
  type ProcurementNavigationPage,
} from "../../domains/procurement/page-registry/navigationClient";

type LoadState =
  | { state: "loading" }
  | { state: "success"; items: ProcurementNavigationPage[] }
  | { state: "error"; message: string };

export function Topbar() {
  const location = useLocation();
  const [loadState, setLoadState] = useState<LoadState>({ state: "loading" });

  useEffect(() => {
    let alive = true;

    fetchProcurementNavigation()
      .then((data) => {
        if (alive) {
          setLoadState({ state: "success", items: data.items });
        }
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "导航加载失败";
        if (alive) {
          setLoadState({ state: "error", message });
        }
      });

    return () => {
      alive = false;
    };
  }, []);

  const breadcrumb = useMemo(() => {
    if (loadState.state !== "success") return ["采购系统", "页面加载中"];

    const active = findNavigationPageByPath(loadState.items, location.pathname);
    const chain = buildNavigationChain(loadState.items, active).map((item) => item.name);

    return chain.length > 0 ? chain : ["采购系统", "概览"];
  }, [loadState, location.pathname]);

  return (
    <header className="wms-topbar">
      <div className="wms-breadcrumb">
        {breadcrumb.map((item, index) => (
          <span key={`${item}-${index}`}>
            {index > 0 ? <span className="wms-breadcrumb-separator">/</span> : null}
            <span className={index === breadcrumb.length - 1 ? "is-current" : ""}>
              {item}
            </span>
          </span>
        ))}
      </div>

      <div className="wms-topbar-right">
        {loadState.state === "error" ? (
          <span className="topbar-error">{loadState.message}</span>
        ) : null}
        <span>采购系统</span>
      </div>
    </header>
  );
}
