import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import { ToastContainer } from 'react-toastify';  


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
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/friends"
          element={
            <ProtectedRoute>

              <DashboardLayout>
                <Friends />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/find-friends"
          element={
            <ProtectedRoute>

              <DashboardLayout>
                <FindFriends />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>

              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/notification/"
          element={<ProtectedRoute>
            <Notification />
          </ProtectedRoute>
          }
        />

        <Route path="/session/:id" element={<ProtectedRoute>

          <Session />
        </ProtectedRoute>
        } />
        <Route path="/video/:id/preview" element={<ProtectedRoute>
          <VideoPreview />
        </ProtectedRoute>
        } />

        <Route path="/video/:id" element={<ProtectedRoute>
          <VideoRoom />
        </ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />

    </Routes>
    <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
