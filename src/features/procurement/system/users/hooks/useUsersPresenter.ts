import { useEffect, useState } from "react";

import {
  createUser as apiCreateUser,
  deleteUser as apiDeleteUser,
  fetchUserPermissionMatrix,
  fetchUsers,
  resetUserPassword,
  updateUser as apiUpdateUser,
  updateUserPermissionMatrix as apiUpdateUserPermissionMatrix,
} from "../api";
import type {
  PermissionMatrixPageDTO,
  PermissionMatrixPagesDTO,
  PermissionMatrixRowDTO,
  UserDTO,
} from "../types";

type UserDetailsMap = Record<number, UserDTO>;

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message.trim() ? error.message : fallback;
}

export function useUsersPresenter() {
  const [matrixPages, setMatrixPages] = useState<PermissionMatrixPageDTO[]>([]);
  const [matrixRows, setMatrixRows] = useState<PermissionMatrixRowDTO[]>([]);
  const [userDetailsById, setUserDetailsById] = useState<UserDetailsMap>({});
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      const [matrix, users] = await Promise.all([fetchUserPermissionMatrix(), fetchUsers()]);
      const detailMap: UserDetailsMap = {};

      for (const user of users) {
        detailMap[user.id] = user;
      }

      setMatrixPages(matrix.pages);
      setMatrixRows(matrix.rows);
      setUserDetailsById(detailMap);
    } catch (err) {
      setError(errorMessage(err, "加载用户权限矩阵失败"));
      setMatrixPages([]);
      setMatrixRows([]);
      setUserDetailsById({});
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function createUser(payload: {
    username: string;
    password: string;
    full_name?: string | null;
    phone?: string | null;
    email?: string | null;
  }) {
    setCreating(true);
    setError(null);

    try {
      await apiCreateUser(payload);
      await load();
    } catch (err) {
      setError(errorMessage(err, "创建用户失败"));
      throw err;
    } finally {
      setCreating(false);
    }
  }

  async function updateUser(
    userId: number,
    payload: {
      full_name?: string | null;
      phone?: string | null;
      email?: string | null;
      is_active?: boolean;
    },
  ) {
    setMutating(true);
    setError(null);

    try {
      await apiUpdateUser(userId, payload);
      await load();
    } catch (err) {
      setError(errorMessage(err, "更新用户失败"));
      throw err;
    } finally {
      setMutating(false);
    }
  }

  async function saveUserPermissionMatrix(userId: number, pages: PermissionMatrixPagesDTO) {
    setMutating(true);
    setError(null);

    try {
      const pageCodes = matrixPages.map((page) => page.page_code);
      await apiUpdateUserPermissionMatrix(userId, pageCodes, pages);
      await load();
    } catch (err) {
      setError(errorMessage(err, "保存用户权限失败"));
      throw err;
    } finally {
      setMutating(false);
    }
  }

  async function deleteUser(userId: number) {
    setMutating(true);
    setError(null);

    try {
      await apiDeleteUser(userId);
      await load();
    } catch (err) {
      setError(errorMessage(err, "删除用户失败"));
      throw err;
    } finally {
      setMutating(false);
    }
  }

  async function resetPassword(userId: number) {
    setMutating(true);
    setError(null);

    try {
      await resetUserPassword(userId);
      await load();
    } catch (err) {
      setError(errorMessage(err, "重置密码失败"));
      throw err;
    } finally {
      setMutating(false);
    }
  }

  return {
    matrixPages,
    matrixRows,
    userDetailsById,
    loading,
    creating,
    mutating,
    error,
    reload: load,
    createUser,
    updateUser,
    saveUserPermissionMatrix,
    deleteUser,
    resetPassword,
    setError,
  };
}

export type UsersPresenter = ReturnType<typeof useUsersPresenter>;
