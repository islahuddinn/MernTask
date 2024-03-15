import logo from "./logo.svg";
import "./App.css";
import AllRoutes from "./routes/AllRoutes";
import { Nevbar } from "./components/Homepage/Nevbar";

function App() {
  return (
    <div className="App">
      <Nevbar />
      <AllRoutes />
    </div>
  );
}

export default App;
