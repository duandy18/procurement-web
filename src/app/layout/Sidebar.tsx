import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

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

type OpenState = Record<string, boolean>;

function sortPages(
  a: Pick<ProcurementNavigationPage, "sort_order" | "name">,
  b: Pick<ProcurementNavigationPage, "sort_order" | "name">,
): number {
  const sortDiff = a.sort_order - b.sort_order;
  if (sortDiff !== 0) return sortDiff;

  return a.name.localeCompare(b.name, "zh-CN");
}

function pagePath(page: ProcurementNavigationPage): string | null {
  return page.primary_route ?? page.route_prefixes[0] ?? null;
}

function activeCodeSet(
  pages: ProcurementNavigationPage[],
  pathname: string,
): Set<string> {
  const active = findNavigationPageByPath(pages, pathname);
  return new Set(buildNavigationChain(pages, active).map((item) => item.code));
}

export function Sidebar() {
  const location = useLocation();
  const [loadState, setLoadState] = useState<LoadState>({ state: "loading" });
  const [openSections, setOpenSections] = useState<OpenState>({});

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

  const pages = useMemo<ProcurementNavigationPage[]>(() => {
    if (loadState.state !== "success") return [];
    return loadState.items;
  }, [loadState]);

  const activeCodes = useMemo(
    () => activeCodeSet(pages, location.pathname),
    [pages, location.pathname],
  );

  useEffect(() => {
    const activeRoot = pages.find((page) => activeCodes.has(page.code));
    if (!activeRoot) return;

    setOpenSections((prev) => ({
      ...prev,
      [activeRoot.code]: true,
    }));
  }, [activeCodes, pages]);

  function toggleSection(code: string) {
    setOpenSections((prev) => ({ ...prev, [code]: !(prev[code] ?? true) }));
  }

  function renderChild(page: ProcurementNavigationPage) {
    const path = pagePath(page);
    const isActive = activeCodes.has(page.code);

    if (!path) return null;

    return (
      <NavLink
        key={page.code}
        to={path}
        className={isActive ? "wms-sidebar-link is-active" : "wms-sidebar-link"}
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
        {loadState.state === "loading" ? (
          <div className="wms-sidebar-message">导航加载中…</div>
        ) : null}

        {loadState.state === "error" ? (
          <div className="wms-sidebar-message is-error">{loadState.message}</div>
        ) : null}

        {pages
          .filter((page) => page.show_in_sidebar)
          .sort(sortPages)
          .map((section) => {
            const isOpen = openSections[section.code] ?? true;
            const children = section.children
              .filter((child) => child.show_in_sidebar)
              .sort(sortPages);

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

                {isOpen ? (
                  <div className="wms-sidebar-children">
                    {children.map(renderChild)}
                  </div>
                ) : null}
              </section>
            );
          })}
      </nav>
    </aside>
  );
}
