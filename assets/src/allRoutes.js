import LayoutsDevRoutes from './layouts/dev/routes.js';
import LayoutsOrganizationRoutes from './layouts/organization/routes.js';
import LayoutsSystemRoutes from './layouts/system/routes.js';
import Routes from './routes.js';

export default [].concat(
    LayoutsDevRoutes,
    LayoutsOrganizationRoutes,
    LayoutsSystemRoutes,
    Routes
);
