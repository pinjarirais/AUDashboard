import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const URLWatcher = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lastPath = useRef(location.pathname);

  useEffect(() => {
    const handleManualURLChange = () => {
      if (location.pathname !== lastPath.current) {
        localStorage.clear();
        navigate("/", { replace: true });
      }
      lastPath.current = location.pathname;
    };

    window.addEventListener("popstate", handleManualURLChange);

    return () => {
      window.removeEventListener("popstate", handleManualURLChange);
    };
  }, [navigate, location]);

  return null;
};
