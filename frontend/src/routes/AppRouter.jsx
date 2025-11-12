import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import Register from "../pages/Register.jsx";
import Login from "../pages/Login.jsx";
import AuthCallback from "../pages/AuthCallback.jsx";
import Home from "../pages/Home.jsx";
import Profile from "../pages/profile/Profile.jsx";
import ProfileEdit from "../pages/profile/ProfileEdit.jsx";
import UsersList from "../pages/users/UsersList.jsx";
import UserDetail from "../pages/users/UserDetail.jsx";
import UserCreate from "../pages/users/UserCreate.jsx";
import UserEdit from "../pages/users/UserEdit.jsx";
import GamesList from "../pages/games/GamesList.jsx";
import GameDetail from "../pages/games/GameDetail.jsx";
import GameCreate from "../pages/games/GameCreate.jsx";
import GameEdit from "../pages/games/GameEdit.jsx";
import PlayLogsList from "../pages/playlogs/PlayLogsList.jsx";
import PlayLogCreate from "../pages/playlogs/PlayLogCreate.jsx";
import PlayLogEdit from "../pages/playlogs/PlayLogEdit.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import PlayLogDetail from "../pages/playlogs/PlayLogDetail.jsx";
import PopularGames from "../pages/games/PopularGames.jsx";
import BestDeals from "../pages/deals/BestDeals.jsx";
import SearchGames from "../pages/games/SearchGames.jsx";
import DetailsGames from "../pages/games/DetailsGames.jsx";

function PrivateRoute() {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingSpinner />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />

        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<ProfileEdit />} />

            <Route path="/users" element={<UsersList />} />
            <Route path="/users/new" element={<UserCreate />} />
            <Route path="/users/:id" element={<UserDetail />} />
            <Route path="/users/:id/edit" element={<UserEdit />} />

            <Route path="/games" element={<GamesList />} />
            <Route path="/games/new" element={<GameCreate />} />
            <Route path="/games/:id" element={<GameDetail />} />
            <Route path="/games/:id/edit" element={<GameEdit />} />
            <Route path="/games/popular" element={<PopularGames />} />
            <Route path="/games/search" element={<SearchGames />} />
            <Route path="/games/details/:id/:slug" element={<DetailsGames />} />

            <Route path="/playlogs" element={<PlayLogsList />} />
            <Route path="/playlogs/new" element={<PlayLogCreate />} />
            <Route path="/playlogs/:id" element={<PlayLogDetail />} />
            <Route path="/playlogs/:id/edit" element={<PlayLogEdit />} />

            <Route path="/deals/best" element={<BestDeals />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
