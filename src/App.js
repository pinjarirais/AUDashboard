import "./App.css";
import Layout from "./component/layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExcelUploader from "./component/Uploads";

function App() {
  
  return (
    <>
    <Router>
      <Routes>
        <Route path='/uploads' element={<ExcelUploader/>}/>
      </Routes>
    </Router>
     <Layout />
    </>
  );
}

export default App;
