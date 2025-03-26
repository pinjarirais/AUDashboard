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
    } catch (error) {
      console.warn("Error occurred: Clearing localStorage and reloading...");
      localStorage.clear();
      window.location.reload(); 
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
