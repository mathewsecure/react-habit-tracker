import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import ExploreIcon from "@mui/icons-material/Explore";
import {
  styled,
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { Link, Outlet } from "react-router-dom";
const NavBar = () => {
  const StyledToolbar = styled(Toolbar)({
    display: "flex",
    justifyContent: "space-evenly",
  });
  const buttonStyle = {
    display: "flex",
    flexDirection: "column",
    textTransform: "none",
    color: "inherit",
    gap: 0.5,
  };
  return (
    <main>
      <AppBar
        position="fixed"
        sx={{
          top: "auto",
          bottom: 0,
          width: "100%",
        }}
      >
        <StyledToolbar>
          <Button component={Link} to="/habits" sx={buttonStyle}>
            <PlaylistAddCheckIcon fontSize="medium" />
            <Typography variant="caption">Habits</Typography>
          </Button>
          <Button component={Link} to="/summary" sx={buttonStyle}>
            <ExploreIcon fontSize="medium" />
            <Typography variant="caption">Summary</Typography>
          </Button>
          <Button component={Link} to="/trends" sx={buttonStyle}>
            <TrendingUpIcon fontSize="medium" />
            <Typography variant="caption">Trends</Typography>
          </Button>
        </StyledToolbar>
      </AppBar>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Outlet />
      </Box>
    </main>
  );
};

export default NavBar;
