import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./views/Login";
import Community from "./views/Community";
import Dashboard from "./views/Dashboard";
import Header from "./components/header/Header";
import RequireAuth from "./routes/RequireAuth";
import Profile from "./views/Profile";
import { useAuth } from "./contexts/auth";
import { useEffect } from "react";
import RequireAdmin from "./routes/RequireAdmin";
import MemberAdd from "./views/MemberAdd";
import MemberEdit from "./views/MemberEdit";

function App() {
  const { getMe } = useAuth();
  useEffect(() => {
    getMe();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<RequireAuth />}>
            <Route path="/community" element={<Community />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route element={<RequireAdmin />}>
            <Route path="/members/:id/edit" element={<MemberEdit />} />
            <Route path="/members/add" element={<MemberAdd />} />
          </Route>
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
