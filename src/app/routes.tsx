import { createBrowserRouter, Outlet } from "react-router";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./components/HomePage";
import { FindDoctors } from "./components/FindDoctors";
import { DoctorDetails } from "./components/DoctorDetails";
import { AboutPage } from "./components/AboutPage";
import { ContactPage } from "./components/ContactPage";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { NotFound } from "./components/NotFound";
import { DashboardPage } from "./components/dashboard/DashboardPage";

function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

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
