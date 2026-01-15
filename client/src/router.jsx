// client/src/router.jsx
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/HomePage";
import BooksPage from "./pages/BooksPage";
import MyBooksPage from "./pages/MyBooksPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { ProtectedLayout, AuthLayout } from "../components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "books",
        element: <BooksPage />,
      },
      // Protected routes - require authentication
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: "my-books",
            element: <MyBooksPage />,
          },
        ],
      },
      // Auth routes - require the user to NOT be authenticated
      {
        element: <AuthLayout />,
        children: [
          {
            path: "register",
            element: <Register />,
          },
          {
            path: "login",
            element: <Login />,
          },
        ],
      },
    ],
  },
]);
