import { Link, Outlet } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  //todo: update section css when done
  return (
    <main>
      <nav>
        <Link to="/habits">Habits</Link>
        <Link to="/summary">Summary</Link>
      </nav>
      <section>
        <Outlet />
      </section>
    </main>
  );
};

export default NavBar;
