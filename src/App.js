import "./App.css";
import Layout from "./component/layout";
import { ToastContainer, toast } from "react-toastify";

function App() {
  
  return (
    <>
     <Layout />
     <ToastContainer limit={1}/>
    </>
  );
}

export default App;
