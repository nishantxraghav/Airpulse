import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../components/layout/Layout/Layout';
import Loader from '../components/common/Loader/Loader';

// Lazy-loaded pages
const Home = lazy(() => import('../pages/Home/Home'));
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));
const CityDetail = lazy(() => import('../pages/CityDetail/CityDetail'));
const Favorites = lazy(() => import('../pages/Favorites/Favorites'));
const Settings = lazy(() => import('../pages/Settings/Settings'));
const NotFound = lazy(() => import('../pages/NotFound/NotFound'));

const PageLoader = () => (
  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Loader variant="spinner" />
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: 'dashboard/:lat/:lon',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'city/:lat/:lon',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CityDetail />
          </Suspense>
        ),
      },
      {
        path: 'favorites',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Favorites />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Settings />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
