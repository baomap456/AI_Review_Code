import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import GitReview from './pages/GitReview';
import ProjectReview from './pages/ProjectReview';  // <-- Bỏ comment dòng này
import ManualReview from './pages/ManualReview';    // <-- Bỏ comment dòng này

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/git" replace />} />
          <Route path="git" element={<GitReview />} />
          <Route path="project" element={<ProjectReview />} /> {/* <-- Bỏ comment dòng này */}
          <Route path="manual" element={<ManualReview />} />   {/* <-- Bỏ comment dòng này */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;