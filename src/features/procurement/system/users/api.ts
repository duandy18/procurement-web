import { apiGet, apiPatch, apiPost, apiPut } from "../../../../lib/api";
import type {
  PermissionMatrixPagesDTO,
  UserDTO,
  UserPermissionMatrixDTO,
  UserPermissionMatrixRawDTO,
} from "./types";

function toBackendPageUpdates(pageCodes: string[], pages: PermissionMatrixPagesDTO) {
  return pageCodes.map((pageCode) => {
    const cell = pages[pageCode];

    return {
      page_code: pageCode,
      can_read: Boolean(cell?.read),
      can_write: Boolean(cell?.write),
    };
  });
}

export async function fetchUserPermissionMatrix(): Promise<UserPermissionMatrixDTO> {
  const raw = await apiGet<UserPermissionMatrixRawDTO>("/admin/users/permission-matrix");

  return {
    pages: Array.isArray(raw.pages) ? raw.pages : [],
    rows: Array.isArray(raw.users) ? raw.users : [],
  };
}

export async function updateUserPermissionMatrix(
  userId: number,
  pageCodes: string[],
  pages: PermissionMatrixPagesDTO,
): Promise<UserDTO> {
  return apiPut<UserDTO>(`/admin/users/${userId}/permission-matrix`, {
    pages: toBackendPageUpdates(pageCodes, pages),
  });
}

export async function fetchUsers(): Promise<UserDTO[]> {
  return apiGet<UserDTO[]>("/admin/users");
}

export async function createUser(payload: {
  username: string;
  password: string;
  full_name?: string | null;
  phone?: string | null;
  email?: string | null;
}): Promise<UserDTO> {
  return apiPost<UserDTO>("/admin/users", {
    ...payload,
    permission_ids: [],
  });
}

export async function updateUser(
  userId: number,
  payload: {
    full_name?: string | null;
    phone?: string | null;
    email?: string | null;
    is_active?: boolean;
  },
): Promise<UserDTO> {
  return apiPatch<UserDTO>(`/admin/users/${userId}`, payload);
}

export async function deleteUser(userId: number): Promise<void> {
  await apiPost(`/admin/users/${userId}/delete`, {});
}

export async function resetUserPassword(userId: number): Promise<void> {
  await apiPost(`/admin/users/${userId}/reset-password`, {});
}
