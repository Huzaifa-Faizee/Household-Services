
import AdminHome from "../pages/admin/AdminHome.js";
import Services from "../pages/admin/Services.js";
import Home from "../pages/Home.js";
import Login from "../pages/Login.js";
import Register from "../pages/Register.js";
import store from './store.js'
const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
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
