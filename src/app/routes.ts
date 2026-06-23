import { createBrowserRouter } from "react-router";
import { PublicLayout } from "./components/PublicLayout";
import { HomePage } from "./components/HomePage";
import { FindDoctors } from "./components/FindDoctors";
import { DoctorDetails } from "./components/DoctorDetails";
import { AboutPage } from "./components/AboutPage";
import { ContactPage } from "./components/ContactPage";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { NotFound } from "./components/NotFound";
import { DashboardPage } from "./components/dashboard/DashboardPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: PublicLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "doctors", Component: FindDoctors },
      { path: "doctors/:id", Component: DoctorDetails },
      { path: "about", Component: AboutPage },
      { path: "contact", Component: ContactPage },
      { path: "login", Component: LoginPage },
      { path: "register", Component: RegisterPage },
      { path: "*", Component: NotFound },
    ],
  },
  {
    path: "/dashboard",
    Component: DashboardPage,
  },
]);
