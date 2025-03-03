import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

const ToastNotification = ({ message, type }) => {
  const toastId = useRef(null);

  useEffect(() => {
    if (message) {
      if (toastId.current) {
        toast.dismiss(toastId.current);
      }
      toastId.current = toast[type](message, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  }, [message, type]);                                                                                  

  return null;
};

export default ToastNotification;