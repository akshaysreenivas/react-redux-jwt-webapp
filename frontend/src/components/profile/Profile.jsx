import React, { useState } from "react";
import "./Profile.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { toast, ToastContainer } from "react-toastify";
import Spinner from "react-bootstrap/esm/Spinner";

function Profile() {
  const navigate = useNavigate();
  const [cookie, setCookie, removeCookie] = useCookies([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  
  useEffect(() => {
    if (!cookie.jwt) {
      navigate("/login");
      return;
    }
    const fetchData = async () => {
      const { data } = await axios.post(
        "http://localhost:5000",
        {},
        { withCredentials: true }
      );

      if (data.status) {
        setName(data.userName);
        setProfileUrl(data.profileUrl);
      } else {
        removeCookie("jwt");
        navigate("/login");
      }
    };
    fetchData();

  }, [cookie.jwt,navigate,removeCookie]);

  const handleSubmit = async () => {
    if (!image) {
      toast.error("select an image", { position: "top-right" });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      const { data } = await axios.post(
        "http://localhost:5000/upload_image",
        { image, profileUrl },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (data.status) {
        setProfileUrl(data.profileUrl);
        toast(data.message, { position: "top-right" });
      } else {
        toast.error(data.error, { position: "top-right" });
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error("Something went wrong", { position: "top-right" });
    }
  };

  const logout = () => {
    removeCookie("jwt");
    navigate("/login");
  };
  return (
    <>
      <nav>
        <div>
          <h2>Welcome ! {name}</h2>
        </div>
        <button className="bg-danger" onClick={logout}>
          logout
        </button>
      </nav>
      <div
        style={{
          backgroundImage: `url(${
            profileUrl
              ? "http://localhost:5000" + profileUrl
              : "https://gbaglobal.org/wp-content/plugins/buddyboss-platform/bp-core/images/profile-avatar-buddyboss.png"
          })`,
        }}
        className="profilePic"
      ></div>

      <div className="d-flex justify-content-center  pic rounded">
        {image ? (
          <img
            alt="Posts"
            width="200px"
            height="200px"
            src={image ? URL.createObjectURL(image) : "jj"}
          ></img>
        ) : (
          <span className="material-icons">cloud_upload</span>
        )}
      </div>
      <div className="m-auto d-flex outline-0 justify-content-center">
        <input onChange={(e) => setImage(e.target.files[0])} type="file" />
      </div>
      <div className="d-flex justify-content-center my-2">
        {loading ? (
          <button className="imgUploadBtn  rounded">
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          </button>
        ) : (
          <button onClick={handleSubmit} className="imgUploadBtn  rounded">
            Submit
          </button>
        )}
      </div>
      <ToastContainer />
    </>
  );
}

export default Profile;
