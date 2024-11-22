import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./RegisterLogin.css";

const RegisterLoginForm = () => {
  const [isRegister, setIsRegister] = useState(false);

  const toggleForm = () => setIsRegister(!isRegister);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg p-4" style={{ width: "28rem" }}>
        <div className="card-body">
          <h2 className="text-center mb-4">{isRegister ? "Register" : "Login"}</h2>
          <form>
            {isRegister && (
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input type="text" className="form-control" id="name" placeholder="Enter your name" />
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your password"
              />
            </div>
            {isRegister && (
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  placeholder="Confirm your password"
                />
              </div>
            )}
            <button type="submit" className="btn btn-primary w-100">
              {isRegister ? "Register" : "Login"}
            </button>
          </form>
          <div className="text-center mt-3">
            <small>
              {isRegister ? "Already have an account? " : "Don't have an account? "}
              <button className="btn btn-link p-0" onClick={toggleForm}>
                {isRegister ? "Login here" : "Register here"}
              </button>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterLoginForm;
