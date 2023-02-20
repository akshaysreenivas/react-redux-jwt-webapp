import './App.css';
import LoginPage from './pages/Login';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import ProfilePage from './pages/profile';
import SignupPage from './pages/signup';
import AdminLogin from './components/adminLogin/AdminLogin';
import AdminHome from './components/admin/AdminHome';
import AddUser from './components/AddUser/AddUser';
import EditUser from './components/editUser/EditUser';


function App() {

  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route exact path="/" element={<ProfilePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/addUser" element={<AddUser />} />
        <Route path="/admin/editUser" element={<EditUser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
