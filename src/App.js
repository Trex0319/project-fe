import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import AddCars from "./AddCars";
import EditCars from "./EditCars";
import Model from "./Model";
import AddModel from "./AddModel";
import Login from "./Login";
import SignUp from "./Signup";
import Detail from "./Detail";
import SaveCart from "./SaveCart";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars_add" element={<AddCars />} />
        <Route path="/cars/:id" element={<EditCars />} />
        <Route path="/model" element={<Model />} />
        <Route path="/model_add" element={<AddModel />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/savecart" element={<SaveCart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
