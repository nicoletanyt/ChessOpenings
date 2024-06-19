import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Main from './components/Main';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/Navbar';
import Openings from './components/Openings';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navbar/>}>
        <Route path="training" element={<Main/>} />
        <Route path="openings" element={<Openings/>} />
        <Route index element={<Navigate to="/openings" />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

