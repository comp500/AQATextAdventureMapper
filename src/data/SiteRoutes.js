import HomePage from "../pages/HomePage";
import NotFound from "../pages/NotFound";

const SiteRoutes = [
	{
		path: '/',
		component: HomePage,
		exact: true,
		status: 200,
	}, {
		path: '/',
		component: NotFound,
		exact: false,
		status: 404,
	}
];

export default SiteRoutes;
