import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import PublicLayout from "../layouts/PublicLayout.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import HomePublic from "./home/HomePublic.jsx";
import HomeAdmin from "./home/HomeAdmin.jsx";
import HomeUser from "./home/HomeUser.jsx";

export default function Home() {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <PublicLayout><HomePublic /></PublicLayout>;
  }

  if (user?.role === "admin") {
    return <MainLayout><HomeAdmin /></MainLayout>;
  }

  return <MainLayout><HomeUser /></MainLayout>;
}
