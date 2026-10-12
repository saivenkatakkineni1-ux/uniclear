import React, { useState } from 'react';
import { 
  GraduationCap, 
  LogOut, 
  User, 
  Shield, 
  Building, 
  CheckCircle2, 
  Menu, 
  X, 
  FileText,
  AlertCircle,
  Home
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onNavigateHome: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, onNavigateHome }) => {
  const { userProfile, user, signOut, activeRoleOverride, setActiveRoleOverride } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  // Determine current active effective role
  const effectiveRole: UserRole = (activeRoleOverride as UserRole) || userProfile?.role || 'student';

  const roleLabels: Record<UserRole, { title: string; color: string; badge: string }> = {
    student: {
      title: 'Graduating Student Portal',
      color: 'bg-blue-600',
      badge: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    department_officer: {
      title: 'Department Clearance Officer Desk',
      color: 'bg-indigo-600',
      badge: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    },
    admin: {
      title: 'Institutional Clearance Administration',
      color: 'bg-purple-600',
      badge: 'bg-purple-100 text-purple-800 border-purple-200'
    }
  };

  const currentRoleConfig = roleLabels[effectiveRole] || roleLabels.student;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            {/* Left: Brand & Portal Title */}
            <div className="flex items-center space-x-3">
              <button 
                type="button"
                onClick={onNavigateHome}
                className="flex items-center space-x-2.5 focus:outline-none cursor-pointer group"
                title="Go to Landing Page"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold tracking-tight text-slate-900">
                      Uni<span className="text-blue-600">Clear</span>
                    </span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${currentRoleConfig.badge}`}>
                      {effectiveRole.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="hidden sm:block text-[11px] text-slate-500 font-medium">
                    {currentRoleConfig.title}
                  </p>
                </div>
              </button>
            </div>

            {/* Right: User Profile, Role Preview Switcher, Logout */}
            <div className="hidden md:flex items-center space-x-4">
              
              {/* Role Switcher Pill for testing/previewing */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowRoleSelector(!showRoleSelector)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center space-x-1.5 transition cursor-pointer"
                  title="Switch between Student, Dept Officer, and Admin views"
                >
                  <Shield className="w-3.5 h-3.5 text-blue-600" />
                  <span>View: <strong className="capitalize">{effectiveRole.replace('_', ' ')}</strong></span>
                  <span className="text-[10px] text-slate-400">▼</span>
                </button>

                {showRoleSelector && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-slate-100 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                      Switch Portal Perspective:
                    </div>
                    <button
                      type="button"
                      onClick={() => { setActiveRoleOverride(null); setShowRoleSelector(false); }}
                      className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between cursor-pointer ${!activeRoleOverride ? 'bg-blue-50 font-bold text-blue-700' : 'text-slate-700'}`}
                    >
                      <span className="flex items-center">
                        <GraduationCap className="w-3.5 h-3.5 mr-2 text-blue-600" />
                        My Registered Profile ({userProfile?.role || 'student'})
                      </span>
                      {!activeRoleOverride && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setActiveRoleOverride('student'); setShowRoleSelector(false); }}
                      className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between cursor-pointer ${activeRoleOverride === 'student' ? 'bg-blue-50 font-bold text-blue-700' : 'text-slate-700'}`}
                    >
                      <span className="flex items-center">
                        <User className="w-3.5 h-3.5 mr-2 text-blue-600" />
                        Student View
                      </span>
                      {activeRoleOverride === 'student' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setActiveRoleOverride('department_officer'); setShowRoleSelector(false); }}
                      className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between cursor-pointer ${activeRoleOverride === 'department_officer' ? 'bg-indigo-50 font-bold text-indigo-700' : 'text-slate-700'}`}
                    >
                      <span className="flex items-center">
                        <Building className="w-3.5 h-3.5 mr-2 text-indigo-600" />
                        Dept Clearance Officer
                      </span>
                      {activeRoleOverride === 'department_officer' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setActiveRoleOverride('admin'); setShowRoleSelector(false); }}
                      className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between cursor-pointer ${activeRoleOverride === 'admin' ? 'bg-purple-50 font-bold text-purple-700' : 'text-slate-700'}`}
                    >
                      <span className="flex items-center">
                        <Shield className="w-3.5 h-3.5 mr-2 text-purple-600" />
                        University Administrator
                      </span>
                      {activeRoleOverride === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />}
                    </button>
                  </div>
                )}
              </div>

              {/* User Identity Chip */}
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 text-left">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                  {(userProfile?.displayName || user?.displayName || 'U')[0].toUpperCase()}
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-slate-900 leading-tight">
                    {userProfile?.displayName || user?.displayName || 'Student User'}
                  </div>
                  <div className="text-slate-500 text-[11px] font-mono">
                    {userProfile?.studentId || user?.email?.split('@')[0] || ''}
                  </div>
                </div>
              </div>

              {/* Home Navigation */}
              <button
                type="button"
                onClick={onNavigateHome}
                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                title="Public Portal"
              >
                <Home className="w-4 h-4" />
              </button>

              {/* Sign Out Button */}
              <button
                type="button"
                onClick={signOut}
                className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5 mr-1" />
                Sign Out
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 px-4 pt-3 pb-4 space-y-3 bg-white">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center">
                {(userProfile?.displayName || 'U')[0].toUpperCase()}
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">{userProfile?.displayName}</div>
                <div className="text-xs text-slate-500">{userProfile?.email}</div>
                <div className="text-xs font-mono text-blue-600">{userProfile?.studentId} &bull; {userProfile?.department}</div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-500 uppercase px-2 pt-1">Preview Role</div>
              <button
                type="button"
                onClick={() => { setActiveRoleOverride('student'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 text-slate-700"
              >
                Student View
              </button>
              <button
                type="button"
                onClick={() => { setActiveRoleOverride('department_officer'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 text-slate-700"
              >
                Department Officer View
              </button>
              <button
                type="button"
                onClick={() => { setActiveRoleOverride('admin'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 text-slate-700"
              >
                Administrator View
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={onNavigateHome}
                className="text-xs font-medium text-slate-600 hover:text-blue-600 flex items-center"
              >
                <Home className="w-4 h-4 mr-1.5" />
                Landing Page
              </button>
              <button
                type="button"
                onClick={signOut}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center"
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            UniClear &bull; Siddhartha Academy of Higher Education &bull; Placement &amp; Department Clearance Portal
          </div>
          <div className="flex items-center space-x-3">
            <span>Support: exams@siddharthaacademy.edu</span>
            <span>&bull;</span>
            <span>Office Hours: 09:00 - 17:00 IST</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
