import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {

  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center gap-3">
        <div className="w-9 h-9 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Verifying Session...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;