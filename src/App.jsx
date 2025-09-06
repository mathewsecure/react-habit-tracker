import { BrowserRouter, Route, Routes } from "react-router-dom";
import HabitsTable from "./components/HabitsTable";
import Layout from "./components/Layout";
import HabitsTable2 from "./__tests__/components/HabitsTable2.test";

function App() {
  return (
    <>
      <h3>Daily habit tracker</h3>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="HabitsTable" element={<HabitsTable />} />
            <Route path="HabitsTable2" element={<HabitsTable2 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
