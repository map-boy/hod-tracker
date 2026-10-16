import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { features } from './registry';
import PortalLayout from '../shared/ui/PortalLayout';
import AuthProvider from '../core/auth/AuthProvider';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<div className="body">Loading...</div>}>
          <Routes>
            <Route element={<PortalLayout />}>
              {features.flatMap((f) =>
                f.routes.map((r) => <Route key={`${f.id}:${r.path}`} path={r.path} element={<r.component />} />),
              )}
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
