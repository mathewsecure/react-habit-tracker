import { BrowserRouter, Route, Routes } from "react-router-dom";
import Habits from "./components/Habits/Habits";
import NavBar from "./components/NavBar/NavBar";
import Graphs from "./components/Graphs/Graphs";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NavBar />}>
            <Route path="habits" element={<Habits />} />
            <Route path="graphs" element={<Graphs />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
