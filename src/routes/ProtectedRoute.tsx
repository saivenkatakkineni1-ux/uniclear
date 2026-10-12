import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  onRedirectToLogin: () => void;
  onRedirectToUnauthorized: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  onRedirectToLogin,
  onRedirectToUnauthorized
}) => {
  const { user, userProfile, loading, activeRoleOverride } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
        <p className="text-xs text-slate-500 font-medium">Authenticating university credentials...</p>
      </div>
    );
  }

  // Not signed in
  if (!user && !activeRoleOverride) {
    onRedirectToLogin();
    return null;
  }

  // Check role restriction if specified
  const currentRole: UserRole = (activeRoleOverride as UserRole) || userProfile?.role || 'student';
  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    onRedirectToUnauthorized();
    return null;
  }

  return <>{children}</>;
};
