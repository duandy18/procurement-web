import { useMemo } from "react";
import { useLocation } from "react-router-dom";

import { useSessionRuntime, type NavigationPage } from "../../shared/runtime";

function flattenPages(pages: NavigationPage[]): NavigationPage[] {
  const out: NavigationPage[] = [];

  function walk(nodes: NavigationPage[]) {
    for (const node of nodes) {
      out.push(node);
      walk(node.children ?? []);
    }
  }

  walk(pages);
  return out;
}

function normalizePath(path: string): string {
  const raw = path.trim();
  if (!raw || raw === "/") return "/";
  const withLeading = raw.startsWith("/") ? raw : `/${raw}`;
  return withLeading.replace(/\/+$/, "");
}

function routeMatches(pathname: string, routePrefix: string): boolean {
  const current = normalizePath(pathname);
  const prefix = normalizePath(routePrefix);

  return current === prefix || current.startsWith(`${prefix}/`);
}

export function Topbar() {
  const location = useLocation();
  const { navigation, user } = useSessionRuntime();

  const breadcrumb = useMemo(() => {
    const pages = navigation?.pages ?? [];
    const routes = navigation?.route_prefixes ?? [];
    const matched = routes
      .filter((route) => routeMatches(location.pathname, route.route_prefix))
      .sort((a, b) => b.route_prefix.length - a.route_prefix.length)[0];

    if (!matched) return ["采购系统", "概览"];

    const flattened = flattenPages(pages);
    const byCode = new Map(flattened.map((page) => [page.code, page]));
    const chain: string[] = [];

    let current: NavigationPage | undefined = byCode.get(matched.page_code);
    while (current) {
      chain.push(current.name);
      current = current.parent_code ? byCode.get(current.parent_code) : undefined;
    }

    return chain.length > 0 ? chain.reverse() : ["采购系统", "概览"];
  }, [location.pathname, navigation]);

  return (
    <header className="wms-topbar">
      <div className="wms-breadcrumb">
        {breadcrumb.map((item, index) => (
          <span key={`${item}-${index}`}>
            {index > 0 ? <span className="wms-breadcrumb-separator">/</span> : null}
            <span className={index === breadcrumb.length - 1 ? "is-current" : ""}>{item}</span>
          </span>
        ))}
      </div>

      <div className="wms-topbar-right">
        <span>{user?.username ?? "采购系统"}</span>
      </div>
    </header>
  );
}
