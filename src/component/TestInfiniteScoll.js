import React,{useState,useEffect} from 'react'
import axios from 'axios'
import InfiniteScroll from "react-infinite-scroll-component";

const TestInfiniteScoll = () => {
   const [data,setData]=useState([]); 
   const [items,setItems]=useState([]);
   const [page, setPage] = useState(1);
   const [hasMore, setHasMore] = useState(true);

   useEffect(()=>{
    fetchData();
   },[])

   //fetchData
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${1}`
      );
      console.log("Data",response.data)
      const newData = response.data;
      setItems((prevItems) => [...prevItems, ...newData]);
      setPage((prevPage) => prevPage + 1); 

      if (newData.length === 0) {
         setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
}


  return (
    <div>TestInfiniteScoll</div>
  )
}

export default TestInfiniteScoll
