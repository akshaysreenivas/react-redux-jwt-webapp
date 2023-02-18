import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Spinner from "react-bootstrap/Spinner";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setErrorMessage("");
    if (!email || email.match(/^\s*$/)) {
      setEmailError("* required");
      return;
    }
    if (!password || password.match(/^\s*$/)) {
      setPasswordError("* required");
      return;
    }
    setLoading(true);
    const generateErrorToast = (err) =>
      toast.error(err, { position: "top-right" });

    try {
      const { data } = await axios.post(
        "http://localhost:5000/login",
        {
          email: email,
          password: password,
        },
        { withCredentials: true }
      );

      if (data) {
        if (data.errors) {
          generateErrorToast(data.errors)
        }
       else if(data.loggedIn){
          navigate("/");
        }
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      generateErrorToast(err.message);
    }
  };

  return (
    <div className="loginParentDiv">
      <div className="loginDiv bg-light m-4">
        <h2 className="text-center">Login</h2>
        <h4 className="text-danger">{errorMessage}</h4>
        <form onSubmit={handleLogin}>
          <label htmlFor="fname">Email</label>
          <input
            className="input"
            type="email"
            id="fname"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <small className="text-danger">{emailError}</small>
          <label htmlFor="lname">Password</label>
          <div className="password_div">
            <input
              className="input "
              type={passwordType === "password" ? "password" : "text"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
            />

            <i className="Eye_icon link" onClick={togglePassword}>
              {passwordType === "password" ? (
                <span className="material-icons"> visibility_off </span>
              ) : (
                <span className="material-icons"> visibility </span>
              )}
            </i>
          </div>
          <small className="text-danger">{passwordError}</small>

          {loading ? (
            <button type="button">
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            </button>
          ) : (
            <button>login</button>
          )}
        </form>
        <div className="d-block text-center">
          <span>Don't have an Account ? </span>
          <span
            className="link text-primary"
            onClick={() => navigate("/signup")}
          >
            signup
          </span>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
