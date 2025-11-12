import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { supabase } from "../services/supabaseService.js";
import AuthLayout from "../layouts/AuthLayout.jsx";
import FormField from "../components/forms/FormField.jsx";
import PasswordField from "../components/forms/PasswordField.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const success = await login(email, password);
    setLoading(false);

    if (success) {
      toast.success("Login realizado com sucesso!");
      navigate("/");
    } else {
      toast.error("E-mail ou senha incorretos.");
    }
  }

  async function handleGoogleLogin() {
    try {
      setGoogleLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: import.meta.env.VITE_URL_CALLBACK_AUTH },
      });
      if (error) {
        throw error;
      }
    } catch (err) {
      toast.error("Falha ao conectar com o Google.");
      console.error(err);
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <AuthLayout actionLabel="Criar conta" actionUrl="/register">
      <h2 className="text-2xl font-semibold text-center text-gray-800">
        Acesse sua conta
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required={true}
          placeholder="exemplo@email.com"
          testid="login-email-input"
        />

        <PasswordField
          label="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          testid="login-password-input"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md shadow-sm transition disabled:opacity-70"
          testid="login-submit-btn"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div className="mt-4">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 rounded-md shadow-sm transition disabled:opacity-70"
          testid="login-google-btn"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          {googleLoading ? "Conectando..." : "Entrar com Google"}
        </button>
      </div>

      <p className="text-sm text-center text-gray-600">
        Ainda não tem conta?{" "}
        <Link
          to="/register"
          className="text-blue-600 hover:text-blue-700 font-medium"
          testid="login-register-link"
        >
          Criar conta
        </Link>
      </p>
    </AuthLayout>
  );
}
