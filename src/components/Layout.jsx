import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <main>
      <nav>
        <Link to="/">home</Link>
        <Link to="/HabitsTable">HabitsTable</Link>
      </nav>
      <section>
        <Outlet />
      </section>
    </main>
  );
};

export default Layout;
