import React, { useContext } from "react";
import { styled, useTheme } from "@mui/material/styles";
import { makeStyles, createStyles } from "@mui/styles";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AppContext } from "../App";

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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import ReportsIcon from "@mui/icons-material/Assessment";

import UsersIcon from "@mui/icons-material/Group";
import OrganizationIcon from "@mui/icons-material/Apartment";

import SettingsIcon from "@mui/icons-material/Settings";

import NCSULogo from "../images/NCSU Logo.png";

const drawerWidth = 250;

const pageData = [
  [
    {
      path: "data-view",
      title: "Data View",
      icon: (
        <FontAwesomeIcon
          icon={faDatabase}
          style={{ height: "24px", width: "24px", padding: "3px" }}
        />
      ),
    },
    {
      path: "generate-reports",
      title: "Generate Reports",
      icon: <ReportsIcon />,
    },
  ],
  [
    {
      path: "manage-users",
      title: "Manage Users",
      icon: <UsersIcon />,
    },
    {
      path: "manage-organization",
      title: "Manage Organization",
      icon: <OrganizationIcon />,
    },
  ],
  [
    {
      path: "settings",
      title: "Settings",
      icon: <SettingsIcon />,
    },
  ],
];

const useStyles = makeStyles((theme) => createStyles({}));
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

export default function MainLayout() {
  const theme = useTheme();
  const classes = useStyles();
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const [open, setOpen] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(pageData[0][0]);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleLogout = () => {
    context.authenticated = false;
    context.loggedInUser = {
      firstname: "",
      lastname: "",
    };
    navigate("/login");
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

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
            sx={{ fontWeight: 700, ml: 1, fontFamily: "UniversCondensed" }}
          >
            {currentPage.title}
          </Typography>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt={`${context.loggedInUser.firstname} ${context.loggedInUser.lastname}`}
                  src="/static/images/avatar/2.jpg"
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleLogout}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
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
        {pageData.map((section, index) => {
          return (
            <Box key={index}>
              <List>
                {section.map((page, pageIndex) => {
                  return (
                    <Link key={page.path} to={`/${page.path}`}>
                      <ListItem button>
                        <ListItemIcon>{page.icon}</ListItemIcon>
                        <ListItemText primary={page.title} />
                      </ListItem>
                    </Link>
                  );
                })}
              </List>
              {index != pageData.length - 1 && <Divider />}
            </Box>
          );
        })}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, height: "100%" }}>
        <DrawerHeader />
        <Box sx={{ width: "100%", backgroundColor: "grey" }}>
          <Paper></Paper>
        </Box>
      </Box>
    </Box>
  );
}
