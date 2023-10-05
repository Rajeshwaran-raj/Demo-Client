import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Login } from "./Pages/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import { RecoilRoot } from "recoil";
import { Home } from "./Pages/Home";
import { Register } from "./Pages/Register";
import { Admin } from "./Pages/Admin";

function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: <Home />,
    },
    {
      path:"/register",
      element:<Register />
    },
    {
      path:"/admin",
      element:<Admin />
    }
  ]);
  return (
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  );
}

export default App;
