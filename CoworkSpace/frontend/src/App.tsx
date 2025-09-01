import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/header/NavBar";
import { SignIn } from "./views/SignIn";
import { Community } from "./views/Community";
import { Dashboard } from "./views/Dashboard";
import { Profile } from "./views/Profile";
import { Events } from "./views/Events";
import { Parameters } from "./views/Parameters";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/community" element={<Community />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/events" element={<Events />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/parameters" element={<Parameters />} />
        </Routes>
      </BrowserRouter>
      <h1>Workspace</h1>
    </>
  );
}

export default App;
