export interface UserMe {
  id: number;
  username: string;
  permissions: string[];
}

export interface NavigationPage {
  code: string;
  name: string;
  parent_code: string | null;
  level: number;
  domain_code: string;
  show_in_topbar: boolean;
  show_in_sidebar: boolean;
  sort_order: number;
  is_active: boolean;
  inherit_permissions: boolean;
  effective_read_permission: string | null;
  effective_write_permission: string | null;
  children: NavigationPage[];
}

export interface NavigationRoutePrefix {
  route_prefix: string;
  page_code: string;
  sort_order: number;
  is_active: boolean;
  effective_read_permission: string | null;
  effective_write_permission: string | null;
}

export interface MyNavigation {
  pages: NavigationPage[];
  route_prefixes: NavigationRoutePrefix[];
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface SessionRuntimeValue {
  user: UserMe | null;
  navigation: MyNavigation | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}
