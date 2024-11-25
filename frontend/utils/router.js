import AdminHome from "../pages/admin/AdminHome.js";
import AdminSearch from "../pages/admin/AdminSearch.js";
import AdminSummary from "../pages/admin/AdminSummary.js";
import Professionals from "../pages/admin/Professionals.js";
import Requests from "../pages/admin/Requests.js";
import Services from "../pages/admin/Services.js";
import Users from "../pages/admin/Users.js";
import Home from "../pages/Home.js";
import Login from "../pages/Login.js";
import Register from "../pages/Register.js";
import RegisterProfessional from "../pages/RegisterProfessional.js";
import ProfessionalHome from "../pages/service-provider/ProfessionalHome.js";
import ProfessionalRequests from "../pages/service-provider/ProfessionalRequests.js";
import IndividualService from "../pages/user/IndividualService.js";
import ProviderProfile from "../pages/user/ProviderProfile.js";
import UserHome from "../pages/user/UserHome.js";
import UserRequests from "../pages/user/UserRequests.js";
import store from "./store.js";
const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/registerProfessional", component: RegisterProfessional },
  // Admin Routes
  {
    path: "/admin-home",
    component: AdminHome,
    meta: { requiresLogin: true, role: "admin" },
  },
  {
    path: "/services",
    component: Services,
    meta: { requiresLogin: true, role: "admin" },
  },
  {
    path: "/users",
    component: Users,
    meta: { requiresLogin: true, role: "admin" },
  },
  {
    path: "/professionals",
    component: Professionals,
    meta: { requiresLogin: true, role: "admin" },
  },
  {
    path: "/admin-search",
    component: AdminSearch,
    meta: { requiresLogin: true, role: "admin" },
  },
  {
    path: "/admin-requests",
    component: Requests,
    meta: { requiresLogin: true, role: "admin" },
  },
  {
    path: "/admin-summary",
    component: AdminSummary,
    meta: { requiresLogin: true, role: "admin" },
  },
  // Professional Routes
  {
    path: "/professional-home",
    component: ProfessionalHome,
    meta: { requiresLogin: true, role: "service_provider" },
  },
  {
    path: "/professional-requests",
    component: ProfessionalRequests,
    meta: { requiresLogin: true, role: "service_provider" },
  },

  // User Routes
  {
    path: "/user-home",
    component: UserHome,
    meta: { requiresLogin: true, role: "user" },
  },
  {
    path: "/individual-service",
    component: IndividualService,
    meta: { requiresLogin: true, role: "user" },
  },
  {
    path: "/user-requests",
    component: UserRequests,
    meta: { requiresLogin: true, role: "user" },
  },
  {
    path: "/provider-profile",
    component: ProviderProfile,
    meta: { requiresLogin: true, role: "user" },
  },
];

const router = new VueRouter({
  routes,
});
// navigation guards
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresLogin)) {
    console.log(store.state.loggedIn);

    if (!store.state.loggedIn) {
      next({ path: "/login" });
    } else if (to.meta.role && to.meta.role != store.state.role) {
      alert("role not authorized");
      next({ path: "/" });
    } else {
      next();
    }
  } else {
    next();
  }
});
export default router;
