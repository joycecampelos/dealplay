import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { createUser } from "../services/userService.js";
import AuthLayout from "../layouts/AuthLayout.jsx";
import FormField from "../components/forms/FormField.jsx";
import PasswordField from "../components/forms/PasswordField.jsx";

export default function Register() {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await createUser(form);
      toast.success("Conta criada com sucesso! Você já pode fazer login.");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.error || "Erro ao criar conta.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout actionLabel="Entrar" actionUrl="/login">
      <h2 className="text-2xl font-semibold text-center text-gray-800">
        Criar conta
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField
          label="Nome"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required={true}
          testid="register-name-input"
        />

        <FormField
          label="Nome de usuário"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required={true}
          testid="register-username-input"
        />

        <FormField
          label="E-mail"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required={true}
          testid="register-email-input"
        />

        <PasswordField
          label="Senha"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder={"••••••••"}
          testid="register-password-input"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md shadow-sm transition disabled:opacity-70"
          testid="register-submit-btn"
        >
          {loading ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      <p className="text-sm text-center text-gray-600">
        Já tem uma conta?{" "}
        <Link
          to="/login"
          className="text-blue-600 hover:text-blue-700 font-medium"
          testid="register-login-link"
        >
          Entrar
        </Link>
      </p>
    </AuthLayout>
  );
}
