
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Complaints from './Complaints';
import Users from './Users';
import Officers from './Officers';
import 'bootstrap/dist/css/bootstrap.min.css';
import Resolutions from './Resolutions';
import AuditLogs from './AuditLogs';

const App = () => {
  return (
    <Router>
    
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Complaints />} />
          <Route path="/users" element={<Users />} />
          <Route path="/officers" element={<Officers />} />
          <Route path="/resolutions" element={<Resolutions />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
