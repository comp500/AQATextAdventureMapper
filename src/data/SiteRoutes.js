import HomePage from "../pages/HomePage";
import NotFound from "../pages/NotFound";

const SiteRoutes = [
  {
    path: '/',
    component: HomePage,
    exact: true,
  }, {
    path: '/',
    component: NotFound,
    exact: false,
  }
];

export default SiteRoutes;
