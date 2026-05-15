export interface UserDTO {
  id: number;
  username: string;
  is_active: boolean;
  full_name?: string | null;
  phone?: string | null;
  email?: string | null;
  permissions: string[];
}

export interface PermissionMatrixCellDTO {
  read: boolean;
  write: boolean;
}

export type PermissionMatrixPagesDTO = Record<string, PermissionMatrixCellDTO>;

export interface PermissionMatrixPageDTO {
  page_code: string;
  page_name: string;
  sort_order: number;
}

export interface PermissionMatrixRowDTO {
  user_id: number;
  username: string;
  full_name?: string | null;
  is_active: boolean;
  pages: PermissionMatrixPagesDTO;
}

export interface UserPermissionMatrixDTO {
  pages: PermissionMatrixPageDTO[];
  rows: PermissionMatrixRowDTO[];
}

export interface UserPermissionMatrixRawDTO {
  pages: PermissionMatrixPageDTO[];
  users: PermissionMatrixRowDTO[];
}
