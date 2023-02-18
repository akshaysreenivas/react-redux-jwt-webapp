import './App.css';
import LoginPage from './pages/Login';
import {BrowserRouter,Route,Routes} from "react-router-dom"
import ProfilePage from './pages/profile';
import SignupPage from './pages/signup';


function App() {
  return (
   <BrowserRouter>
   <Routes>
   <Route path="/login" element={<LoginPage />} />
   <Route exact path="/" element={<ProfilePage />} />
   <Route path="/signup" element={<SignupPage />} />
   </Routes>
   </BrowserRouter>
  );
}

export default App;
