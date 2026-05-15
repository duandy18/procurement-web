import { useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { useSessionRuntime, type NavigationPage } from "../../shared/runtime";

type OpenState = Record<string, boolean>;

function sortPages(
  a: Pick<NavigationPage, "sort_order" | "name">,
  b: Pick<NavigationPage, "sort_order" | "name">,
): number {
  const sortDiff = a.sort_order - b.sort_order;
  if (sortDiff !== 0) return sortDiff;

  return a.name.localeCompare(b.name, "zh-CN");
}

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

export function Sidebar() {
  const location = useLocation();
  const { navigation, user, logout } = useSessionRuntime();
  const [openSections, setOpenSections] = useState<OpenState>({});

  const pages = useMemo(() => navigation?.pages ?? [], [navigation]);
  const routeMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const route of navigation?.route_prefixes ?? []) {
      if (!map.has(route.page_code)) {
        map.set(route.page_code, route.route_prefix);
      }
    }
    return map;
  }, [navigation]);

  const activeCodes = useMemo(() => {
    const flattened = flattenPages(pages);
    const byCode = new Map(flattened.map((page) => [page.code, page]));
    const matched = (navigation?.route_prefixes ?? [])
      .filter((route) => routeMatches(location.pathname, route.route_prefix))
      .sort((a, b) => b.route_prefix.length - a.route_prefix.length)[0];

    if (!matched) return new Set<string>();

    const output = new Set<string>();
    let current: NavigationPage | undefined = byCode.get(matched.page_code);

    while (current) {
      output.add(current.code);
      current = current.parent_code ? byCode.get(current.parent_code) : undefined;
    }

    return output;
  }, [location.pathname, navigation?.route_prefixes, pages]);

  function toggleSection(code: string) {
    setOpenSections((prev) => ({ ...prev, [code]: !(prev[code] ?? true) }));
  }

  function renderLink(page: NavigationPage) {
    const path = routeMap.get(page.code);
    if (!path) return null;

    return (
      <NavLink
        key={page.code}
        to={path}
        className={activeCodes.has(page.code) ? "wms-sidebar-link is-active" : "wms-sidebar-link"}
      >
        {page.name}
      </NavLink>
    );
  }

  return (
    <aside className="wms-sidebar">
      <div className="wms-sidebar-brand">
        <strong>Procurement</strong>
        <small>独立采购系统</small>
      </div>

      <nav className="wms-sidebar-nav">
        {pages.length === 0 ? <div className="wms-sidebar-message">暂无可访问页面</div> : null}

        {pages
          .filter((page) => page.show_in_sidebar)
          .sort(sortPages)
          .map((section) => {
            const isOpen = openSections[section.code] ?? true;
            const children = section.children
              .filter((child) => child.show_in_sidebar)
              .sort(sortPages);
            const nodes = children.length > 0 ? children : [section];

            return (
              <section key={section.code} className="wms-sidebar-section">
                <button
                  type="button"
                  className="wms-sidebar-section-button"
                  onClick={() => toggleSection(section.code)}
                >
                  <span>{section.name}</span>
                  <span>{isOpen ? "▾" : "▸"}</span>
                </button>

                {isOpen ? <div className="wms-sidebar-children">{nodes.map(renderLink)}</div> : null}
              </section>
            );
          })}
      </nav>

      <div className="wms-sidebar-footer">
        <div>{user?.username ?? "-"}</div>
        <button type="button" onClick={logout}>
          退出登录
        </button>
      </div>
    </aside>
  );
}
