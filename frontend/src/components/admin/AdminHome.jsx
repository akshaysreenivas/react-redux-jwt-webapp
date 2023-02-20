import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "./AdminHome.css";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../features/UserSlice";

function AdminHome() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [cookie, setCookie, removeCookie] = useCookies([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!cookie.token) {
      navigate("/admin/login");
      return;
    }
    const fetchData = async () => {
      const { data } = await axios.post(
        "http://localhost:5000/admin/getUsers",
        {},
        { withCredentials: true }
      );
      if (data.status) {
        if (data.users) {
          const user = data.users;
          setUsers([...user]);
        }
      }
    };
    fetchData();
  }, [cookie, navigate]);

  const logout = () => {
    removeCookie("token");
    navigate("/admin/login");
  };

  return (
    <>
      <nav className="position-sticky top-0 bg-light ">
        <div>
          <h2>Welcome ! Admin</h2>
        </div>
        <button className="bg-danger" onClick={logout}>
          logout
        </button>
      </nav>
      <div className="d-flex align-items-center justify-content-center">
        <h2> Users List</h2>
      </div>
      <div className="new_user_add mx-5">
        <button onClick={() => navigate("/admin/addUser")}>
          add new users
        </button>
      </div>
      <div className="p-5 d-flex align-items-center justify-content-center">
        {users.length ? (
          <table className="table">
            <thead>
              <tr>
                <th scope="col">User ID</th>
                <th scope="col">Username</th>
                <th scope="col">Email</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => {
                // delete data
                const handleDelete = async () => {
                  const userId = item._id;
                  const { data } = await axios.post(
                    "http://localhost:5000/admin/deleteUser",
                    {
                      userId: userId,
                    },
                    { withCredentials: true }
                  );
                  if (data.status) {
                    const newusers = users.filter(
                      (item) => item._id !== userId
                    );
                    setUsers(newusers);
                    toast("Successfully Deleted", { position: "top-right" });
                  }
                };
                return (
                  <tr key={item._id}>
                    <th scope="row">{item._id}</th>
                    <td className="">{item.username}</td>
                    <td className="">{item.email}</td>
                    <td className="">
                      <button
                        className="m-2"
                        onClick={() => {
                          dispatch(
                            setUserDetails({
                              id: item._id,
                              name: item.username,
                              email: item.email,
                            })
                          );
                          navigate("/admin/editUser");
                        }}
                      >
                        edit
                      </button>
                      <button onClick={handleDelete}>delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="p-5">
            <h3 className="text-secondary"> No datas to show </h3>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
}

export default AdminHome;
