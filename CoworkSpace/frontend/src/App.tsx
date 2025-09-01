import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./views/Login";
import { Community } from "./views/Community";
import { Dashboard } from "./views/Dashboard";
import { Profile } from "./views/Profile";
import { Events } from "./views/Events";
import { Settings } from "./views/Settings";
import Header from "./components/header/Header";
import RequireAuth from "./routes/RequireAuth";

function App() {
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
            <Route path="/events" element={<Events />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
