import { createBrowserRouter } from "react-router";
import Mainlayouts from "../layouts/Mainlayouts";
import Home from "../pages/Home";
import Error from "../pages/Error";
import Register from "../pages/Register";
import Login from "../pages/Login";
import CreateAssignment from "../pages/CreateAssignment";
import Assignments from "../pages/Assignments";
import PendingAssignments from "../pages/PendingAssignments";
import MyAssignments from "../pages/MySubmissions";
import Privaterouter from "../contexts/Privateprovider";
import AssignmentDetailsPage from "../pages/ViewAssignment";

export const Router = createBrowserRouter([
  {
    path: "/",
    Component: Mainlayouts,
    children: [
      {
        index: true,
        path: "/",
        Component: Home,
      },
      {
        path: "/register",
        Component: Register,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/CreateAssignment",
        element: (
          <Privaterouter>
            <CreateAssignment></CreateAssignment>
          </Privaterouter>
        ),
      },
      {
        path: "/Assignments",
        Component: Assignments,
      },
      {
        path: "/pending",
        element: (
          <Privaterouter>
            <PendingAssignments></PendingAssignments>
          </Privaterouter>
        ),
      },
      {
        path: "/assignmentDetails/:id",
        element: (
          <Privaterouter>
            <AssignmentDetailsPage></AssignmentDetailsPage>
          </Privaterouter>
        ),
      },
      {
        path: "/mysubmission",
        element: (
          <Privaterouter>
            <MyAssignments></MyAssignments>
          </Privaterouter>
        ),
      },
    ],
  },
  {
    path: "/*",
    Component: Error,
  },
]);
