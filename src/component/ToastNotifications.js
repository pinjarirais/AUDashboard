import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

const ToastNotification = ({ message, type }) => {
  const hasDisplayed = useRef(false);

  useEffect(() => {
    if (message && !hasDisplayed.current) {
      hasDisplayed.current = true;
      if (type === "error") {
        toast.error(message, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
      } else if (type === "success") {
        toast.success(message, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
      }
    }
  }, [message, type]);

  return null;
};

export default ToastNotification;
