import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Spinner from "react-bootstrap/Spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useCookies } from "react-cookie";

function Login() {
  const [cookie] = useCookies([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (cookie.jwt) {
      navigate("/");
      return;
    }
  }, [navigate, cookie.jwt]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const togglePassword = () => {
    setPasswordType(!passwordType);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
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
      toast.error(err, { position: "top-center" });

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_USER_SERVER_API}/login`,
        {
          email: email,
          password: password,
        },
        { withCredentials: true }
      );

      if (data) {
        if (data.errors) {
          generateErrorToast(data.errors);
        } else if (data.loggedIn) {
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
              type={passwordType ? "password" : "text"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
            />

            <i className="Eye_icon link" onClick={togglePassword}>
              {passwordType ? (
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
