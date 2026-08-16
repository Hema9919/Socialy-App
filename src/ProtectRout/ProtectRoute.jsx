import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function ProtectRoute(props) {
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token && !sessionStorage.getItem("loginToastShown")) {
      toast.error("Login first");
      sessionStorage.setItem("loginToastShown", "true");
    }
  }, [token]);

  if (token) {
    sessionStorage.removeItem("loginToastShown");
    return props.children;
  }

  return <Navigate to="/login" replace />;
}