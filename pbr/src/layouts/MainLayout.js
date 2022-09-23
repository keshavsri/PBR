import React from "react";
import { styled, useTheme } from "@mui/material/styles";
import { makeStyles, createStyles } from "@mui/styles";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import AuthConsumer from "../services/useAuth";

import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import {
  Box,
  Toolbar,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  List,
  CssBaseline,
  Typography,
  Divider,
  Paper,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import ReportsIcon from "@mui/icons-material/Assessment";

import UsersIcon from "@mui/icons-material/Group";
import OrganizationIcon from "@mui/icons-material/Apartment";

import SettingsIcon from "@mui/icons-material/Settings";
import LoginCard from "../components/login/LoginCard";
import CustomDialog from "../components/CustomDialog";

const drawerWidth = 250;

const pageData = [
  [
    {
      path: "/data-view",
      title: "Data View",
      icon: (
        <FontAwesomeIcon
          icon={faDatabase}
          style={{ height: "24px", width: "24px", padding: "3px" }}
        />
      ),
    },
    {
      path: "/generate-reports",
      title: "Generate Reports",
      icon: <ReportsIcon />,
    },
  ],
  [
    {
      path: "/manage-users",
      title: "Manage Users",
      icon: <UsersIcon />,
    },
    {
      path: "/manage-organization",
      title: "Manage Organization",
      icon: <OrganizationIcon />,
    },
  ],
  [
    {
      path: "/logging-view",
      title: "View System Logs",
      icon: <PendingActionsIcon />,
    },
    {
      path: "/settings",
      title: "Settings",
      icon: <SettingsIcon />,
    },
  ],
];

const useStyles = makeStyles((theme) =>
  createStyles({
    ".navbar-active": {
      backgroundColor: "red",
    },
    ".MuiMenuItem-root": {
      borderRadius: "0px",
    },
  })
);
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  transition: "all .6s",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiButtonBase-root": {
    borderRadius: "0px !important",
  },
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  "& .MuiButtonBase-root": {
    borderRadius: "0px !important",
  },
  "& .MuiPaper-root": {
    backgroundColor: "#454545",
    fontWeight: "700 !important",
    color: "rgba(255,255,255,0.8)",
  },
  "& svg": {
    color: "rgba(255,255,255,0.8)",
  },
  a: {
    color: "rgba(255,255,255,0.8)",
  },
  "& .MuiListItemText-primary": {
    color: "rgb(255, 255, 255)",
    fontWeight: "500",
  },
  "& .MuiListItemText-secondary": {
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: "UniversCondensed",
  },
  "& MuiDivider-root": {
    borderBottomColor: "red !IMPORTANT",
  },
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MainLayout(props) {
  const theme = useTheme();
  useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(pageData[0][0]);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { user, logout, recredentialize, setRecredentialize } = AuthConsumer();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleOpenUserMenu = (event) => {
    console.log(event.currentTarget);
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // console.log(location.pathname);
  // let page = pageData.find((page) => page.path === location.pathname);
  // console.log(page);
  // setCurrentPage(page);
  // console.log(currentPage);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          {currentPage.icon}
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{
              fontWeight: 700,
              ml: 1,
              fontFamily: "UniversCondensed",
              flexGrow: 1,
            }}
          >
            {currentPage.title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open} sx={{ backgroundColor: "grey" }}>
        <DrawerHeader sx={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <Box
            sx={{
              width: "100%",
              color: "white",
              textAlign: "left",
              overflow: "hidden",
            }}
          >
            <Typography
              variant="p"
              component="h1"
              sx={{
                margin: "0 auto",
                fontSize: "1rem",
                fontFamily: "UniversCondensed",
              }}
            >
              Poultry Bloodwork
              <br />
              Reporting Tool
            </Typography>
          </Box>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <Box sx={{ flexGrow: 1 }}>
          {pageData.map((section, index) => {
            return (
              <Box key={index}>
                <List>
                  {section.map((page, pageIndex) => {
                    return (
                      <NavLink
                        key={page.path}
                        to={`${page.path}`}
                        className={({ isActive }) =>
                          isActive ? "navbar-active" : ""
                        }
                      >
                        <ListItem button>
                          <ListItemIcon>{page.icon}</ListItemIcon>
                          <ListItemText primary={page.title} />
                        </ListItem>
                      </NavLink>
                    );
                  })}
                </List>
                {index !== pageData.length - 1 && <Divider />}
              </Box>
            );
          })}
        </Box>
        <Box>
          {user && (
            <Box sx={{ flexGrow: 1 }}>
              <Tooltip title="User Actions">
                <ListItem
                  button
                  onClick={handleOpenUserMenu}
                  sx={{
                    height: "60px",
                    pl: "8px",
                    pr: "8px",
                    backgroundColor: "rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <ListItemIcon>
                    <Avatar
                      alt={user ? `${user.firstname} ${user.lastname}` : ""}
                    />
                  </ListItemIcon>
                  <Box
                    sx={{
                      overflow: "hidden",
                      display: "inline-block",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <ListItemText
                      primary={
                        user
                          ? `${user.firstname} ${user.lastname}`
                          : user && user.email
                          ? user.email
                          : ""
                      }
                      secondary={user ? `${user.email}` : ""}
                    />
                  </Box>
                </ListItem>
              </Tooltip>

              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleLogout} sx={{ borderRadius: 0 }}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, height: "100%", minWidth: "0px" }}
      >
        <DrawerHeader />
        <Box sx={{ width: "100%", backgroundColor: "grey" }}>
          <CustomDialog
            open={recredentialize}
            handleClose={() => {}}
            maxWidth="sm"
          >
            <LoginCard />
          </CustomDialog>
          <Box>{props.children}</Box>
        </Box>
      </Box>
    </Box>
  );
}
