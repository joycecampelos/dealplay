import { useEffect, useRef, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { supabase } from "../services/supabaseService.js";
import api from "../services/apiService.js";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { updateUserContext } = useContext(AuthContext);
  const executed = useRef(false);
  const [stage, setStage] = useState("loading");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    async function handleAuth() {
      if (executed.current) {
        return;
      }
      executed.current = true;

      try {
        const { data, error } = await supabase.auth.getSession();

        if (error || !data?.session) {
          setStage("error");
          toast.error("Falha ao autenticar com Google.");
          setTimeout(() => navigate("/login"), 1500);
          return;
        }

        const token = data.session.access_token;
        const res = await api.post(
          "/auth/supabase",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const userData = res.data.data;
        localStorage.setItem("token", userData.token);
        localStorage.setItem("user", JSON.stringify(userData));

        updateUserContext(userData);

        setUserName(userData.name);
        setStage("success");
        toast.success(`Bem-vindo(a), ${userData.name}!`);
        
        setTimeout(() => navigate("/"), 1500);
      } catch (err) {
        console.error("Erro no callback OAuth:", err);
        setStage("error");
        toast.error("Erro ao finalizar login com Google.");
        setTimeout(() => navigate("/login"), 1500);
      }
    }

    handleAuth();
  }, [navigate, updateUserContext]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <AnimatePresence mode="wait">
        {stage === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-lg text-gray-700 font-medium">
              Conectando ao Google...
            </p>
          </motion.div>
        )}

        {stage === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-2xl font-semibold text-green-600 mb-2">
              Bem-vindo(a)!
            </p>
            <p className="text-lg text-gray-700">{userName}</p>
            <p className="text-sm text-gray-500 mt-2">Carregando sua conta...</p>
          </motion.div>
        )}

        {stage === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-lg text-red-600 font-semibold mb-2">
              Ocorreu um erro.
            </p>
            <p className="text-gray-600">Redirecionando para o login...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
