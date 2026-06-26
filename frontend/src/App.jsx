import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PrivateRoute, AdminRoute } from "./routes/PrivateRoute";

import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import ChangePassword from "./components/ChangePassword";
import SearchUsers from "./components/SearchUsers";

import PostList from "./components/Posts/PostList";
import CreatePost from "./components/Posts/CreatePost";
import PostDetail from "./components/Posts/PostDetail";

import PhotoList from "./components/Photos/PhotoList";
import UploadPhoto from "./components/Photos/UploadPhoto";
import PhotoDetail from "./components/Photos/PhotoDetail";

import ConversationList from "./components/Messages/ConversationList";
import ChatWindow from "./components/Messages/ChatWindow";

import FriendList from "./components/Friends/FriendList";
import SendRequest from "./components/Friends/SendRequest";
import PendingRequests from "./components/Friends/PendingRequests";

import AdminUsers from "./components/Admin/AdminUsers";
import UserPosts from "./components/Admin/UserPosts";
import UserPhotos from "./components/Admin/UserPhotos";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          <Route
            path="/change-password"
            element={
              <PrivateRoute>
                <ChangePassword />
              </PrivateRoute>
            }
          />

          <Route
            path="/search"
            element={
              <PrivateRoute>
                <SearchUsers />
              </PrivateRoute>
            }
          />

          
          <Route
            path="/posts"
            element={
              <PrivateRoute>
                <PostList />
              </PrivateRoute>
            }
          />

          <Route
            path="/posts/create"
            element={
              <PrivateRoute>
                <CreatePost />
              </PrivateRoute>
            }
          />

          <Route
            path="/posts/:id"
            element={
              <PrivateRoute>
                <PostDetail />
              </PrivateRoute>
            }
          />

          {/* Photos */}
          <Route
            path="/photos"
            element={
              <PrivateRoute>
                <PhotoList />
              </PrivateRoute>
            }
          />

          <Route
            path="/photos/upload"
            element={
              <PrivateRoute>
                <UploadPhoto />
              </PrivateRoute>
            }
          />

          <Route
            path="/photos/:id"
            element={
              <PrivateRoute>
                <PhotoDetail />
              </PrivateRoute>
            }
          />

          {/* Messages */}
          <Route
            path="/messages"
            element={
              <PrivateRoute>
                <ConversationList />
              </PrivateRoute>
            }
          />

          <Route
            path="/messages/:userId"
            element={
              <PrivateRoute>
                <ChatWindow />
              </PrivateRoute>
            }
          />

          {/* Friends */}
          <Route
            path="/friends"
            element={
              <PrivateRoute>
                <FriendList />
              </PrivateRoute>
            }
          />

          <Route
            path="/friends/send"
            element={
              <PrivateRoute>
                <SendRequest />
              </PrivateRoute>
            }
          />

          <Route
            path="/friends/requests"
            element={
              <PrivateRoute>
                <PendingRequests />
              </PrivateRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/users/:userId/posts"
            element={
              <AdminRoute>
                <UserPosts />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/users/:userId/photos"
            element={
              <AdminRoute>
                <UserPhotos />
              </AdminRoute>
            }
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
