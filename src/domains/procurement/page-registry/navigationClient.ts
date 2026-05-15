import { apiUrl } from "../../../lib/api";

export interface ProcurementNavigationPage {
  code: string;
  name: string;
  parent_code: string | null;
  level: number;
  domain_code: string;
  show_in_topbar: boolean;
  show_in_sidebar: boolean;
  sort_order: number;
  route_prefixes: string[];
  primary_route: string | null;
  children: ProcurementNavigationPage[];
}

export interface ProcurementNavigationOut {
  items: ProcurementNavigationPage[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asNullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function asBoolean(value: unknown): boolean {
  return typeof value === "boolean" ? value : false;
}

function asNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function parsePage(value: unknown): ProcurementNavigationPage | null {
  if (!isRecord(value)) return null;

  const code = asString(value.code).trim();
  const name = asString(value.name).trim();

  if (!code || !name) return null;

  const routePrefixes = Array.isArray(value.route_prefixes)
    ? value.route_prefixes.filter((item): item is string => typeof item === "string")
    : [];

  const children = Array.isArray(value.children)
    ? value.children.map(parsePage).filter((item): item is ProcurementNavigationPage => item !== null)
    : [];

  return {
    code,
    name,
    parent_code: asNullableString(value.parent_code),
    level: asNumber(value.level),
    domain_code: asString(value.domain_code),
    show_in_topbar: asBoolean(value.show_in_topbar),
    show_in_sidebar: asBoolean(value.show_in_sidebar),
    sort_order: asNumber(value.sort_order),
    route_prefixes: routePrefixes,
    primary_route: asNullableString(value.primary_route),
    children,
  };
}

function parseNavigation(value: unknown): ProcurementNavigationOut {
  if (!isRecord(value)) {
    return { items: [] };
  }

  const items = Array.isArray(value.items)
    ? value.items.map(parsePage).filter((item): item is ProcurementNavigationPage => item !== null)
    : [];

  return { items };
}

export function normalizePath(path: string): string {
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

export function flattenNavigationPages(
  pages: ProcurementNavigationPage[],
): ProcurementNavigationPage[] {
  const output: ProcurementNavigationPage[] = [];

  function walk(nodes: ProcurementNavigationPage[]) {
    for (const node of nodes) {
      output.push(node);
      walk(node.children);
    }
  }

  walk(pages);
  return output;
}

export function findNavigationPageByPath(
  pages: ProcurementNavigationPage[],
  pathname: string,
): ProcurementNavigationPage | null {
  const flattened = flattenNavigationPages(pages);
  const matches = flattened
    .flatMap((page) =>
      page.route_prefixes.map((routePrefix) => ({
        page,
        routePrefix: normalizePath(routePrefix),
      })),
    )
    .filter((item) => routeMatches(pathname, item.routePrefix))
    .sort((a, b) => b.routePrefix.length - a.routePrefix.length);

  return matches[0]?.page ?? null;
}

export function buildNavigationChain(
  pages: ProcurementNavigationPage[],
  activePage: ProcurementNavigationPage | null,
): ProcurementNavigationPage[] {
  if (!activePage) return [];

  const flattened = flattenNavigationPages(pages);
  const byCode = new Map(flattened.map((page) => [page.code, page]));

  const chain: ProcurementNavigationPage[] = [];
  let current: ProcurementNavigationPage | undefined = activePage;

  while (current) {
    chain.push(current);
    current = current.parent_code ? byCode.get(current.parent_code) : undefined;
  }

  return chain.reverse();
}

export async function fetchProcurementNavigation(): Promise<ProcurementNavigationOut> {
  const response = await fetch(apiUrl("/procurement/page-registry/navigation"));

  if (!response.ok) {
    throw new Error(`采购页面注册导航加载失败：${response.status}`);
  }

  const payload: unknown = await response.json();
  return parseNavigation(payload);
}
