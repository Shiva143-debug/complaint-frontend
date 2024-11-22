// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Complaints from './Complaints';
// import Users from './Users';
// import Officers from './Officers';
// import RegisterLoginForm from './RegisterLoginForm';

// import 'primereact/resources/themes/saga-blue/theme.css';
// import 'primereact/resources/primereact.min.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'primeicons/primeicons.css';


// const App = () => {
//   return (
//     <Router> 
//       <div className="container mt-4">
//         <Routes>
//            <Route path="/" element={<RegisterLoginForm />} />
//           <Route path="/complaints" element={<Complaints />} />
//           <Route path="/users" element={<Users />} />
//           <Route path="/officers" element={<Officers />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// };

// export default App;


import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import RegisterLoginForm from "./RegisterLoginForm";
import Complaints from "./Complaints";
import Users from "./Users";
import Officers from "./Officers";
import Mycomplaints from "./Mycomplaints";
import Roles from "./Roles";

const App = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

const AppLayout = () => {
  const location = useLocation();

  // Check if the current path is Register/Login page
  const isAuthPage = location.pathname === "/";

  return (
    <div className="d-flex">
      {!isAuthPage && <Sidebar />}
      <div className={!isAuthPage ? "content-with-sidebar" : "content-full"}>
        {!isAuthPage && <Header/>}
        <div className={!isAuthPage ? "container mt-4" : ""}>
          <Routes>
            <Route path="/" element={<RegisterLoginForm />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/my-complaints" element={<Mycomplaints />} />
            <Route path="/users" element={<Users />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/officers" element={<Officers />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
