/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Landing } from './pages/public/Landing';
import { Login } from './pages/public/Login';
import { SignUp } from './pages/public/SignUp';
import { ForgotPassword } from './pages/public/ForgotPassword';
import { Unauthorized } from './pages/public/Unauthorized';
import { DashboardLayout } from './layouts/DashboardLayout';
import { RoleDashboard } from './pages/dashboards/RoleDashboard';
import { ProtectedRoute } from './routes/ProtectedRoute';

type AppView = 'landing' | 'login' | 'signup' | 'forgot-password' | 'dashboard' | 'unauthorized';

function MainApp() {
  const { user, loading, activeRoleOverride } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('landing');

  // Sync route if user state changes
  useEffect(() => {
    if (!loading) {
      if (user || activeRoleOverride) {
        // If logged in and on landing or auth screens, automatically transition to dashboard
        if (currentView === 'login' || currentView === 'signup') {
          setCurrentView('dashboard');
        }
      } else {
        // If logged out and on protected screens, transition to login
        if (currentView === 'dashboard') {
          setCurrentView('login');
        }
      }
    }
  }, [user, activeRoleOverride, loading]);

  const isAuthenticated = Boolean(user || activeRoleOverride);

  return (
    <>
      {currentView === 'landing' && (
        <Landing
          isAuthenticated={isAuthenticated}
          onNavigateToLogin={() => setCurrentView('login')}
          onNavigateToSignUp={() => setCurrentView('signup')}
          onNavigateToDashboard={() => setCurrentView('dashboard')}
        />
      )}

      {currentView === 'login' && (
        <Login
          onNavigateToSignUp={() => setCurrentView('signup')}
          onNavigateToForgotPassword={() => setCurrentView('forgot-password')}
          onLoginSuccess={() => setCurrentView('dashboard')}
        />
      )}

      {currentView === 'signup' && (
        <SignUp
          onNavigateToLogin={() => setCurrentView('login')}
          onRegistrationSuccess={() => setCurrentView('dashboard')}
        />
      )}

      {currentView === 'forgot-password' && (
        <ForgotPassword
          onNavigateToLogin={() => setCurrentView('login')}
        />
      )}

      {currentView === 'unauthorized' && (
        <Unauthorized
          onReturnToHome={() => setCurrentView('landing')}
        />
      )}

      {currentView === 'dashboard' && (
        <ProtectedRoute
          onRedirectToLogin={() => setCurrentView('login')}
          onRedirectToUnauthorized={() => setCurrentView('unauthorized')}
        >
          <DashboardLayout
            onNavigateHome={() => setCurrentView('landing')}
          >
            <RoleDashboard />
          </DashboardLayout>
        </ProtectedRoute>
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
