import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Friends from "./pages/Friends";
import FindFriends from "./pages/FindFriends";
import Profile from "./pages/Profile";
import Register from "./Register";
import Login from "./Login";
import Notification from "./pages/Notification";
import Session from "./pages/Session";
import VideoRoom from "./pages/VideoRoom";
import VideoPreview from "./pages/VideoPreview";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/register'
          element={
            <Register />
          }
        />
        <Route
          path='/login'
          element={
            <Login />
          }
        />

        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />

        <Route
          path="/friends"
          element={
            <DashboardLayout>
              <Friends />
            </DashboardLayout>
          }
        />

        <Route
          path="/find-friends"
          element={
            <DashboardLayout>
              <FindFriends />
            </DashboardLayout>
          }
        />

        <Route
          path="/profile"
          element={
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          }
        />

        <Route
          path="/notification/"
          element={<Notification />}
        />

        <Route path="/session/:id" element={<Session />} />
        <Route path="/video/:id/preview" element = {<VideoPreview/>} />

        <Route path="/video/:id" element={<VideoRoom />} />



      </Routes>
    </BrowserRouter>
  );
}

export default App;
