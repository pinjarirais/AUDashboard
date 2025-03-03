import "./App.css";
import Layout from "./component/layout";
import { ToastContainer, toast } from "react-toastify";

function App() {
  
  return (
    <>
    <ToastContainer limit={1}/>
     <Layout />
    </>
  );
}

export default App;
