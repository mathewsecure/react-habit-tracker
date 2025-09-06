import { BrowserRouter, Route, Routes } from "react-router-dom";
import HabitsTable from "./components/HabitsTable";
import Layout from "./components/Layout";

function App() {
  return (
    <>
      <h3>Daily habit tracker</h3>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="HabitsTable" element={<HabitsTable />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
