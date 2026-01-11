import { BrowserRouter, Route, Routes } from "react-router-dom";
import Habits from "./components/Habits/Habits";
import NavBar from "./components/NavBar/NavBar";
import Summary from "./components/Summary/Summary";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NavBar />}>
            <Route path="habits" element={<Habits />} />
            <Route path="summary" element={<Summary />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
