const Home = {
  template: `<h1> this is home </h1>`,
};
import AdminHome from "../pages/admin/AdminHome.js";
import Services from "../pages/admin/Services.js";
import Login from "../pages/Login.js";
import Register from "../pages/Register.js";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/admin-home", component: AdminHome },
  { path: "/services", component: Services },
];

const router = new VueRouter({
  routes,
});

export default router;
