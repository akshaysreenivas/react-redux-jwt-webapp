import { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "./AddUser.css";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useCookies } from 'react-cookie';

export default function AddUser() {
  const [cookie] = useCookies([]);
  const navigate = useNavigate();
  useEffect(() => {
  if (!cookie.token){
    navigate("/admin/login");
    return
  } 
  
}, [navigate,cookie.token])
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [PasswordError, setPasswordError] = useState("");
  const [NameError, setNameError] = useState("");
  const [EmailError, setEmailError] = useState("");
  const [passwordType, setPasswordType] = useState(true);
  const [loading, setLoading] = useState(false);

  const togglePassword = () => {
      setPasswordType(!passwordType);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setEmailError("");
    setNameError("");
    if (!username || username.match(/^\s*$/)) {
      setNameError("* username field required");
      return;
    }
    if (!email || email.match(/^\s*$/)) {
      setEmailError("* email field required");
      return;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      setEmailError("Invalid email address");
      return;
    }
    if (!password || password.match(/^\s*$/)) {
      setPasswordError("* Password field required");
      return;
    }
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "password should contain at least one uppercase letter, one lowercase letter, one digit, and at least 8 characters"
      );
      return;
    }
    setLoading(true);

    const generateErrorToast = (err) =>
      toast.error(err, { position: "top-center" });

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_USER_SERVER_API}/register`,{
          username: username,
          email: email,
          password: password,
        },{ withCredentials: true }
      );

      if (data) {

        if (data.errors) {
          const { username, email, password,other } = data.errors;
          if (username) generateErrorToast(username);
          else if (email) generateErrorToast(email);
          else if (password) generateErrorToast(password);
          else if (other) generateErrorToast(other);
        } else if(data.created) {
          navigate("/admin");
        }
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      generateErrorToast(err.message)
    }
  };

  return (
    <div className="signupParentDiv">
      <div className="signupDiv bg-light m-4">
        <h2 className="text-center">Create New User</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="fname">Username</label>
          <input
            className="input"
            type="text"
            id="fname"
            name="name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <small className="text-danger">{NameError}</small>
          <label htmlFor="email">Email</label>
          <input
            className="input"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
          />
          <small className="text-danger">{EmailError}</small>
          <label htmlFor="password">Password</label>

          <div className="password_div">
            <input
              className="input "
              type={passwordType  ? "password" : "text"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
            />
            <i className="Eye_icon" onClick={togglePassword}>
              {passwordType ? (
                <span className="material-icons"> visibility_off </span>
              ) : (
                <span className="material-icons"> visibility </span>
              )}
            </i>
          </div>

          <small className="text-danger">{PasswordError}</small>

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
            <button>Create</button>
          )}
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
