import React, { useEffect } from "react";
import "./AdminLogin.css";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Spinner from "react-bootstrap/esm/Spinner";
import axios from "axios";
import { useCookies } from "react-cookie";

function AdminLogin() {
  const [cookie] = useCookies([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (cookie.token){
        navigate("/admin");
        return
    } 
  }, [navigate, cookie.token]);
  const [username, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState(true);
  const [loading, setLoading] = useState(false);
  // toggle password visibility

  const togglePassword = () => {
    setPasswordType(!passwordType);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || username.match(/^\s*$/)) {
      toast.error("username required", { position: "top-center" });
      return;
    }
    if (!password || password.match(/^\s*$/)) {
      toast.error("password required", { position: "top-center" });
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_ADMIN_SERVER_API}/login`,
        {
          username,
          password,
        },
        { withCredentials: true }
      );
      if (data.status) {
        navigate("/admin");
      } else {
        toast.error(data.errors, { position: "top-center" });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Server error", { position: "top-center" });
    }
  };
  return (
    <>
      <div className="loginParentDiv">
        <div className="loginDiv bg-light m-4">
          <h2 className="text-center">Admin Login</h2>
          <form onSubmit={handleLogin}>
            <label htmlFor="fname">User Name</label>
            <input
              className="input"
              type="text"
              id="fname"
              name="text"
              value={username}
              onChange={(e) => setName(e.target.value)}
            />
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
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

export default AdminLogin;
