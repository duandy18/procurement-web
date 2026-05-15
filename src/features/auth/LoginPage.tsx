// src/features/auth/LoginPage.tsx
//
// 采购系统正式登录页
// - 不依赖 Tailwind 工具类
// - 对齐 WMS 的企业系统登录门面：左侧品牌区 + 右侧登录卡片
// - 保留 procurement-api /users/login 合同

import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { useSessionRuntime } from "../../shared/runtime";

type ApiErrorShape = {
  message?: string;
  body?: { detail?: string };
};

function getEnvLabel(): string {
  const raw = String(import.meta.env.VITE_PROCUREMENT_ENV || import.meta.env.MODE || "dev");
  const value = raw.toLowerCase();

  if (value.includes("prod")) return "生产环境";
  if (value.includes("pilot") || value.includes("pre") || value.includes("trial")) {
    return "中试环境";
  }
  if (value.includes("test")) return "测试环境";

  return "开发环境";
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useSessionRuntime();

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const envLabel = getEnvLabel();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("请输入用户名和密码");
      return;
    }

    setSubmitting(true);

    try {
      await login({ username: username.trim(), password });
      navigate("/procurement/purchase-orders", { replace: true });
    } catch (err: unknown) {
      const apiError = err as ApiErrorShape | undefined;
      const message =
        apiError?.body?.detail ||
        apiError?.message ||
        "登录失败，请检查用户名或密码是否正确。";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="procurement-login-page">
      <section className="procurement-login-shell">
        <aside className="procurement-login-brand">
          <div className="procurement-login-badge">
            <span className="procurement-login-badge-dot" />
            采购链路 · WMS 收货联动 · 可审计闭环
          </div>

          <div className="procurement-login-brand-copy">
            <h1>安快泰采购管理系统</h1>
            <p>
              独立采购系统 · 采购单创建 · PMS 商品投影 · WMS 采购入库联动，
              为采购履约提供可追踪、可授权、可审计的端到端能力。
            </p>
          </div>

          <div className="procurement-login-flow-card">
            <div className="procurement-login-flow-top">
              <div>采购计划</div>
              <div>收货联动</div>
            </div>

            <div className="procurement-login-flow-line">
              <span />
              <strong>procurement_flow</strong>
              <span />
            </div>

            <div className="procurement-login-flow-bottom">
              <div>
                <small>Orders</small>
                <strong>采购单</strong>
              </div>
              <div>
                <small>Projection</small>
                <strong>商品投影</strong>
              </div>
              <div>
                <small>Receiving</small>
                <strong>入库回写</strong>
              </div>
            </div>
          </div>

          <footer>本系统版权归北京安快泰科技有限公司所有</footer>
        </aside>

        <section className="procurement-login-form-area">
          <div className="procurement-login-env">{envLabel}</div>

          <form className="procurement-login-form-card" onSubmit={handleSubmit}>
            <div className="procurement-login-form-title">
              <h2>登录 安快泰</h2>
              <p>请输入用户名与密码登录采购系统，所有操作将记录至审计日志。</p>
            </div>

            {error ? <div className="procurement-login-error">{error}</div> : null}

            <label className="procurement-login-field">
              <span>用户名</span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                placeholder="请输入用户名"
              />
            </label>

            <label className="procurement-login-field">
              <span>密码</span>
              <div className="procurement-login-password-box">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  placeholder="请输入密码"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  title={showPassword ? "隐藏密码" : "显示密码"}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </label>

            <button
              type="submit"
              className="procurement-login-submit"
              disabled={submitting}
            >
              {submitting ? "登录中…" : "登录"}
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}
