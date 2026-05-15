import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { useSessionRuntime } from "../../shared/runtime";

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useSessionRuntime();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/procurement/purchase-orders", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await login({ username: username.trim(), password });
      navigate("/procurement/purchase-orders", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "登录失败");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Procurement</p>
        <h1>采购系统登录</h1>
        <p>使用采购系统独立账号登录。默认管理员：admin / admin123。</p>

        {error ? <div className="alert alert-error">{error}</div> : null}

        <label>
          <span>用户名</span>
          <input value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>

        <label>
          <span>密码</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        <button type="submit" className="button button-primary" disabled={submitting}>
          {submitting ? "登录中…" : "登录"}
        </button>
      </form>
    </main>
  );
}
