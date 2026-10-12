import React, { useState } from 'react';
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight,
  UserPlus,
  ShieldCheck,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface LoginProps {
  onNavigateToSignUp: () => void;
  onNavigateToForgotPassword: () => void;
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ 
  onNavigateToSignUp, 
  onNavigateToForgotPassword,
  onLoginSuccess
}) => {
  const { signIn, error: authError, clearError, setActiveRoleOverride } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (!email.trim()) {
      setFormError('Please enter your college email address.');
      return;
    }
    if (!password) {
      setFormError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn(email.trim(), password);
      setLoginSuccess(true);
      setTimeout(() => {
        onLoginSuccess();
      }, 500);
    } catch (err: any) {
      setFormError(err.message || 'Unable to sign in. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick helper to preview officer/admin workflows safely without fake hardcoding
  const handleQuickDemoRole = (role: 'department_officer' | 'admin') => {
    setActiveRoleOverride(role);
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Background accents */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-100 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-100 blur-3xl"></div>
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="flex items-center justify-center space-x-3 mb-2">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">Uni<span className="text-blue-600">Clear</span></span>
            <span className="ml-2 text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
              Siddhartha Academy
            </span>
          </div>
        </div>

        <h2 className="mt-4 text-center text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Sign In to Your Account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Access your departmental no-dues status, clearance approvals, and placement clearance certificate.
        </p>

        {/* PROMINENT "Don't have an account? Sign Up" CALLOUT */}
        <div className="mt-3 text-center">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-medium text-slate-700">
            <span>Don't have an account?</span>
            <button
              type="button"
              onClick={onNavigateToSignUp}
              className="ml-2 font-bold text-blue-600 hover:text-blue-800 transition inline-flex items-center underline cursor-pointer"
            >
              Sign Up here
              <ArrowRight className="ml-1 w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          
          {/* Error Banner */}
          {(formError || authError) && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-800 animate-fadeIn">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold">Sign In Notice: </span>
                  {formError || authError}
                </div>
                <button 
                  type="button" 
                  onClick={() => { setFormError(null); clearError(); }}
                  className="text-rose-500 hover:text-rose-700 text-xs font-semibold"
                >
                  Dismiss
                </button>
              </div>

              {(String(formError || authError).includes('Email/Password') || String(formError || authError).includes('operation-not-allowed')) && (
                <div className="mt-3 pt-3 border-t border-rose-200/80 bg-rose-100/60 -mx-1 -mb-1 p-3 rounded-lg text-xs text-rose-900 space-y-1">
                  <div className="font-bold">To enable Email/Password in your Firebase Console:</div>
                  <ol className="list-decimal list-inside space-y-0.5 pl-1 text-[11px] text-rose-950">
                    <li>Open your project at <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="underline font-bold text-blue-700">Firebase Console</a>.</li>
                    <li>Go to <strong>Authentication &rarr; Sign-in method</strong>.</li>
                    <li>Click <strong>Email/Password</strong> and toggle <strong>Enable</strong> to ON.</li>
                  </ol>
                </div>
              )}
            </div>
          )}

          {/* Success Banner */}
          {loginSuccess && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-3 text-sm text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Credentials Verified!</span>
                <p className="mt-0.5 text-xs text-emerald-700">Loading your university dashboard...</p>
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* College Email Address */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                College Email Address
              </label>
              <div className="mt-1.5 relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 h-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rollno@university.edu"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm text-slate-900 border border-slate-300 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={onNavigateToForgotPassword}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 focus:outline-none cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="mt-1.5 relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 h-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your account password"
                  className="block w-full pl-10 pr-10 py-2.5 text-sm text-slate-900 border border-slate-300 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting || loginSuccess}
                className="w-full flex justify-center items-center py-2.8 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition duration-150 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                    Verifying Credentials...
                  </>
                ) : (
                  <>
                    Sign In to Portal
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* CLEARLY VISIBLE "Don't have an account? Sign Up" SECTION */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 mb-2">First time on the University No-Dues Portal?</p>
            <button
              type="button"
              onClick={onNavigateToSignUp}
              className="w-full flex items-center justify-center py-2.5 px-4 border border-blue-200 rounded-xl text-sm font-semibold text-blue-700 bg-blue-50/60 hover:bg-blue-100/70 hover:border-blue-300 transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4 mr-2 text-blue-600" />
              Don't have an account? Sign Up
            </button>
          </div>

          {/* Institutional Role Preview Notice */}
          <div className="mt-6 p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs text-slate-600">
            <div className="flex items-center space-x-1.5 font-semibold text-slate-700 mb-1">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Administrative Roles:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500 mb-2.5">
              Department approvers and campus auditors use provisioned institutional keys. You can also preview their review interfaces:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoRole('department_officer')}
                className="py-1 px-2 text-[11px] font-medium bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-slate-700 text-center transition cursor-pointer"
              >
                Dept Officer View
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoRole('admin')}
                className="py-1 px-2 text-[11px] font-medium bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-slate-700 text-center transition cursor-pointer"
              >
                Admin Audit View
              </button>
            </div>
          </div>

        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          Office of the Controller of Examinations &bull; Training and Placement Cell
        </div>
      </div>
    </div>
  );
};
