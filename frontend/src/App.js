import './App.css';
import LoginPage from './pages/Login';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import ProfilePage from './pages/profile';
import SignupPage from './pages/signup';
import AdminLogin from './components/adminLogin/AdminLogin';
import AdminHome from './components/admin/AdminHome';


function App() {

  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route exact path="/" element={<ProfilePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/home" element={<AdminHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
