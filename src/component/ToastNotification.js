import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastNotification = ({ message, type }) => {
  const toastId = useRef(null);

  useEffect(() => {
    if (message) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast[type](message, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
          progressClassName: "custom-progress",
          style: {
            backgroundColor: "#9a48a9",
            color: "#fff",
          },
        });
      }
    }
  }, [message, type]);

  return (
    <>
      <style>
        {`
           .custom-progress {
            background-color: #ffffff !important;
          }

          .Toastify__progress-bar--default {
            background-color: #ffffff !important;
          }

          .Toastify__toast input[type="checkbox"] {
            accent-color: #5b217e !important; 
          }
        `}
      </style>
    </>
  );
};

export default ToastNotification;
