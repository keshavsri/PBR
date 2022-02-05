import React, { useState, createContext, useContext } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Login from "./components/Login";
import DataView from "./components/DataView";

// defaultState = {
//   loggedInUser: null,
// };

const AuthContext = React.createContext();

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/data-view" element={<Login />} />
        <Route path="/generate-reports" element={<Login />} />
        <Route path="/manage-users" element={<Login />} />
        <Route path="/manage-organization" element={<Login />} />
        <Route path="/settings" element={<Login />} />
      </Routes>
    </LocalizationProvider>
  );
}

export default App;
