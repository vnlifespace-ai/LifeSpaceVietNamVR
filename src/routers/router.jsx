import Can1APage from "../pages/hiyori/can1a/page";
import Can1BPage from "../pages/hiyori/can1b/page";
import Can2APage from "../pages/hiyori/can2a/page";
import Can2BPage from "../pages/hiyori/can2b/page";
import Can3APage from "../pages/hiyori/can3a/page";
import Can3BPage from "../pages/hiyori/can3b/page";
import CanAPage from "../pages/mia/cana";
import CanBPage from "../pages/mia/canb";
import CanCPage from "../pages/mia/canc";
import CanDPage from "../pages/mia/cand";
import CanEPage from "../pages/mia/cane";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import ProjectsPage from "../pages/projects";
import VrScenePage from "../pages/vrscene";
import PublicViewPage from "../pages/view";
import ProtectedRoute from "./ProtectedRoute";

const router = [
    {
        path: '/',
        element: <Login />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '/auth/login',
        element: <Login />,
    },
    {
        path: '/auth/register',
        element: <Register />,
    },
    {
        path: '/view/:slug',
        element: <PublicViewPage />,
    },
    {
        path: '/dashboard',
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    },
    {
        path: '/projects',
        element: (
            <ProtectedRoute>
                <ProjectsPage />
            </ProtectedRoute>
        ),
    },
    {
        path: '/vrscene/:idProject',
        element: (
            <ProtectedRoute>
                <VrScenePage />
            </ProtectedRoute>
        ),
    },
    {
        path: '/hiyori',
        children: [
            {
                path: 'can1a',
                element: <Can1APage />,
                index: true
            },
            {
                path: 'can1b',
                element: <Can1BPage />
            },
            {
                path: 'can2a',
                element: <Can2APage />
            },
            {
                path: 'can2b',
                element: <Can2BPage />
            },
            {
                path: 'can3a',
                element: <Can3APage />
            },
            {
                path: 'can3b',
                element: <Can3BPage />
            }
        ]
    },
    {
        path: '/mia',
        children: [
            {
                path: 'cana',
                element: <CanAPage />,
                index: true
            },
            {
                path: 'canb',
                element: <CanBPage />
            },
            {
                path: 'canc',
                element: <CanCPage />
            },
            {
                path: 'cand',
                element: <CanDPage />
            },
            {
                path: 'cane',
                element: <CanEPage />
            }
        ]
    }
];

export default router;
