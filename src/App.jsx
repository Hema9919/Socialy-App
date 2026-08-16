import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login/Login";
import NotFound from "./pages/NotFound/NotFound";
import SignUp from "./pages/SignUp/SignUp";
import { Toaster } from "react-hot-toast";
import MainLayout from "./layout/MainLayout/MainLayout";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import { AuthProvider } from "./context/AuthContext";
import UserContextProvider from "./context/UserContext";
import ProtectRoute from "./ProtectRout/ProtectRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DetailsPost from "./pages/DetaliesPost/DetailsPost";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/signup",
    element: <SignUp />,
  },

  {
    path: "/",
    element: (
      <ProtectRoute>
        <MainLayout />
      </ProtectRoute>
    ),

    children: [
      {
        path: "home",
        element: (
          <ProtectRoute>
            <Home />
          </ProtectRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectRoute>
            <Profile />
          </ProtectRoute>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
      {
        path: "posts/:postId",
        element: (
          <ProtectRoute>
            <DetailsPost />
          </ProtectRoute>
        ),
      },
    ],
  },
]);
const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <AuthProvider>
          <Toaster position="top-center" reverseOrder={false} />{" "}
          <RouterProvider router={router} />
        </AuthProvider>
      </UserContextProvider>
    </QueryClientProvider>
  );
}

export default App;
