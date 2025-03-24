import axios from "axios";
import { useEffect, useState } from "react";

const useDataFetch = (url, token = null) => {
  const [userData, setUserData] = useState([]);
  const [isLoding, setIsLoding] = useState(false);
  const [isError, setIsError] = useState(false);

  async function userdata() {
    setIsLoding(true);

    // const token = JSON.parse(localStorage.getItem("token")) || ""; // Handle null case
    // const headers = token ? { Authorization: `Bearer ${token}` } : {}; // Set header only if token exists
    // console.log("headers >>>>>>>", headers)

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      });
      console.log("data response >>>>>", response);
      setUserData(response.data);
      setIsLoding(false);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.warn("403 Forbidden: Clearing localStorage and redirecting...");
        localStorage.clear();
        window.location.reload(); // Force reload after clearing storage
      }
      setIsError(error.message || "An error occurred while fetching data");
    } finally {
      setIsLoding(false);
    }
  }

  useEffect(() => {
    userdata();
  }, [url, token]);

  return [userData, isLoding, isError];
};

export default useDataFetch;
