import { Link, Outlet } from "react-router-dom";
import "./Layout.css";

const Layout = () => {
  //todo: update section css when done
  return (
    <main>
      <nav>
        <Link to="/">home</Link>
        <Link to="/HabitsTable">HabitsTable</Link>
        <Link to="/HabitsTable2">HabitsTable2</Link>
      </nav>
      <section>
        <Outlet />
      </section>
    </main>
  );
};

export default Layout;
