import React, { lazy, Suspense } from 'react';
import ProtectedRoute from "./ProtectedRoute";

const PageLoader = () => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#0a0c10',
        color: '#de913f',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '15px',
        fontWeight: '600'
    }}>
        Đang tải trang...
    </div>
);

const LazyLoad = (Component) => (
    <Suspense fallback={<PageLoader />}>
        <Component />
    </Suspense>
);

const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const ProjectsPage = lazy(() => import("../pages/projects"));
const VrScenePage = lazy(() => import("../pages/vrscene"));
const VrSceneEditPage = lazy(() => import("../pages/vrscene/edit"));
const PublicViewPage = lazy(() => import("../pages/view"));
const UsersPage = lazy(() => import("../pages/users"));


const router = [
    {
        path: '/',
        element: LazyLoad(Login),
    },
    {
        path: '/login',
        element: LazyLoad(Login),
    },
    {
        path: '/register',
        element: LazyLoad(Register),
    },
    {
        path: '/auth/login',
        element: LazyLoad(Login),
    },
    {
        path: '/auth/register',
        element: LazyLoad(Register),
    },
    {
        path: '/view/:slug',
        element: LazyLoad(PublicViewPage),
    },
    {
        path: '/dashboard',
        element: (
            <ProtectedRoute>
                {LazyLoad(Dashboard)}
            </ProtectedRoute>
        ),
    },
    {
        path: '/projects',
        element: (
            <ProtectedRoute>
                {LazyLoad(ProjectsPage)}
            </ProtectedRoute>
        ),
    },
    {
        path: '/users',
        element: (
            <ProtectedRoute>
                {LazyLoad(UsersPage)}
            </ProtectedRoute>
        ),
    },
    {
        path: '/vrscene/:idProject',
        element: (
            <ProtectedRoute>
                {LazyLoad(VrScenePage)}
            </ProtectedRoute>
        ),
    },
    {
        path: '/vrscene/edit/:idProject',
        element: (
            <ProtectedRoute>
                {LazyLoad(VrSceneEditPage)}
            </ProtectedRoute>
        ),
    }
];

export default router;
