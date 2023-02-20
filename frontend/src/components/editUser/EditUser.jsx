import { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "./EditUser.css";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";

export default function EditUser() {
  const user = useSelector((state) => state.user);
  const [cookie] = useCookies([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (!cookie.token) {
      navigate("/admin/login");
      return;
    }
  }, [navigate, cookie.token]);
  const [username, setUsername] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("No user found");
      return;
    }
    if (!username || username.match(/^\s*$/)) {
      toast.error("User Name Required");
      return;
    }
    if (!email || email.match(/^\s*$/)) {
      toast.error("Email Required");
      return;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      toast.error("Invalid email address");
      return;
    }
    setLoading(true);

    const generateErrorToast = (err) =>
      toast.error(err, { position: "top-right" });

    try {
      const { data } = await axios.post(
        "http://localhost:5000/admin/editUser",
        { username, email, userId: user.id },
        { withCredentials: true }
      );
      if (data.status) {
        navigate("/admin");
      } else if (data.codeName === "DuplicateKey") {
        toast.error("Email already exists", { position: "top-right" });
      } else {
        toast.error("something went wrong", { position: "top-right" });
      }

      if (data) {
        if (data.errors) {
          const { username, email, other } = data.errors;
          if (username) generateErrorToast(username);
          else if (email) generateErrorToast(email);
          else if (other) generateErrorToast(other);
        } else if (data.status) {
          navigate("/admin");
        }
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      generateErrorToast(err.message);
    }
  };

  return (
    <div className="EditParentDiv">
      <div className="EditDiv bg-light m-4">
        <h2 className="text-center">Edit User</h2>
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
          <label htmlFor="email">Email</label>
          <input
            className="input"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
          />
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
            <button>Edit</button>
          )}
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
