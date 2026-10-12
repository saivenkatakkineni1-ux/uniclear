import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  User, 
  Hash, 
  Building2, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SignUpProps {
  onNavigateToLogin: () => void;
  onRegistrationSuccess: () => void;
}

export const DEPARTMENTS = [
  'Computer Science & Engineering (CSE)',
  'Information Technology (IT)',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
  'Chemical Engineering (CHE)',
  'Biotechnology (BT)',
  'Master of Business Administration (MBA)',
  'Master of Computer Applications (MCA)',
  'Department of Applied Sciences & Humanities'
];

export const SignUp: React.FC<SignUpProps> = ({ onNavigateToLogin, onRegistrationSuccess }) => {
  const { signUp, error: authError, clearError } = useAuth();

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Password Strength Evaluation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: 'None', color: 'bg-slate-200' };
    
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
      case 2:
        return { score: 1, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-600' };
      case 3:
        return { score: 2, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-600' };
      case 4:
        return { score: 3, label: 'Good', color: 'bg-blue-500', text: 'text-blue-600' };
      case 5:
        return { score: 4, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-600' };
      default:
        return { score: 0, label: 'None', color: 'bg-slate-200', text: 'text-slate-400' };
    }
  }, [password]);

  // Validation Checks
  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
    match: password.length > 0 && confirmPassword.length > 0 && password === confirmPassword,
  };

  const validateForm = (): boolean => {
    setFormError(null);
    clearError();

    if (!fullName.trim()) {
      setFormError('Please enter your full name as registered in university records.');
      return false;
    }
    if (fullName.trim().length < 3) {
      setFormError('Full name must be at least 3 characters long.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setFormError('Please provide a valid college or university email address.');
      return false;
    }

    if (!studentId.trim()) {
      setFormError('Please enter your Student ID or Roll Number.');
      return false;
    }

    if (!department) {
      setFormError('Please select your academic department.');
      return false;
    }

    if (password.length < 8) {
      setFormError('Password must be at least 8 characters long.');
      return false;
    }

    if (passwordStrength.score < 2) {
      setFormError('Please create a stronger password with letters, numbers, and symbols.');
      return false;
    }

    if (password !== confirmPassword) {
      setFormError('Password and confirm password do not match.');
      return false;
    }

    if (!agreeTerms) {
      setFormError('Please confirm that you are registering with legitimate student enrollment credentials.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setFormError(null);

    try {
      await signUp({
        fullName: fullName.trim(),
        email: email.trim(),
        studentId: studentId.trim(),
        department,
        password,
      });

      setRegistrationSuccess(true);
      // Wait briefly so the user sees the confirmation message, then redirect to student dashboard
      setTimeout(() => {
        onRegistrationSuccess();
      }, 1200);
    } catch (err: any) {
      // Firebase error is already formatted and set in AuthContext or thrown
      setFormError(err.message || 'Registration could not be completed. Please review your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Background accents */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-100 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-100 blur-3xl"></div>
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        {/* University Header Brand */}
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
          Student Portal Registration
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 max-w-sm mx-auto">
          Create your official account to initiate department no-dues clearance and placement eligibility verification.
        </p>

        {/* Existing account banner */}
        <div className="mt-3 text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline focus:outline-none transition-colors"
            >
              Sign In here
            </button>
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          
          {/* Security Banner Note */}
          <div className="mb-6 p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl flex items-start space-x-3 text-xs text-blue-900">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Official Student Enrollment:</span> New sign-ups receive verified student clearance access. Department officer and admin permissions are strictly provisioned by the university administration.
            </div>
          </div>

          {/* Error Message Alert */}
          {(formError || authError) && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-800 animate-fadeIn">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold">Registration Notice: </span>
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

              {/* Specific guide if Email/Password provider is disabled in Firebase console */}
              {(String(formError || authError).includes('Email/Password') || String(formError || authError).includes('operation-not-allowed')) && (
                <div className="mt-3 pt-3 border-t border-rose-200/80 bg-rose-100/60 -mx-1 -mb-1 p-3 rounded-lg text-xs text-rose-900 space-y-1.5">
                  <div className="font-bold flex items-center">
                    <span>How to enable Email/Password in your Firebase Console (30 seconds):</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px] text-rose-950">
                    <li>Go to the <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="underline font-bold text-blue-700 hover:text-blue-900">Firebase Console</a> and select your project.</li>
                    <li>Click <strong>Build &rarr; Authentication</strong> in the left sidebar.</li>
                    <li>Click the <strong>Sign-in method</strong> tab.</li>
                    <li>Click <strong>Email/Password</strong>, toggle <strong>Enable</strong> to ON, and click <strong>Save</strong>.</li>
                    <li>Once saved, come back and click <em>Complete Registration</em> again!</li>
                  </ol>
                </div>
              )}
            </div>
          )}

          {/* Success Message Alert */}
          {registrationSuccess && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-3 text-sm text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Account Registered Successfully!</span>
                <p className="mt-1 text-xs text-emerald-700">
                  Your student clearance profile has been created. Redirecting to your No-Dues Dashboard...
                </p>
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="mt-1.5 relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-5 h-5" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm text-slate-900 border border-slate-300 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                />
              </div>
            </div>

            {/* Grid for Email & Student ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* College Email Address */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  College Email <span className="text-rose-500">*</span>
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
                    placeholder="student@university.edu"
                    className="block w-full pl-10 pr-3.5 py-2.5 text-sm text-slate-900 border border-slate-300 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                  />
                </div>
              </div>

              {/* Student ID / Roll Number */}
              <div>
                <label htmlFor="studentId" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Student ID / Roll No <span className="text-rose-500">*</span>
                </label>
                <div className="mt-1.5 relative rounded-lg shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Hash className="h-5 h-5" />
                  </div>
                  <input
                    id="studentId"
                    name="studentId"
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                    placeholder="e.g. 2022-CSE-084"
                    className="block w-full pl-10 pr-3.5 py-2.5 text-sm text-slate-900 uppercase border border-slate-300 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition tracking-wide"
                  />
                </div>
              </div>
            </div>

            {/* Department */}
            <div>
              <label htmlFor="department" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Department / Program <span className="text-rose-500">*</span>
              </label>
              <div className="mt-1.5 relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="h-5 h-5" />
                </div>
                <select
                  id="department"
                  name="department"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 text-sm text-slate-900 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition appearance-none"
                >
                  <option value="">Select your academic department...</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Password <span className="text-rose-500">*</span>
                </label>
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
                    placeholder="Min. 8 characters"
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

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="mt-1.5 relative rounded-lg shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-5 h-5" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className={`block w-full pl-10 pr-10 py-2.5 text-sm text-slate-900 border rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                      confirmPassword && !checks.match 
                        ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500' 
                        : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Strength Meter & Live Feedback */}
            {password.length > 0 && (
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-600">Password Strength:</span>
                  <span className={`font-semibold ${passwordStrength.text}`}>
                    {passwordStrength.label}
                  </span>
                </div>
                
                {/* Visual Bar Indicator */}
                <div className="grid grid-cols-4 gap-1.5 h-1.5">
                  <div className={`rounded-full transition-all ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-slate-200'}`} />
                  <div className={`rounded-full transition-all ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-slate-200'}`} />
                  <div className={`rounded-full transition-all ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-slate-200'}`} />
                  <div className={`rounded-full transition-all ${passwordStrength.score >= 4 ? passwordStrength.color : 'bg-slate-200'}`} />
                </div>

                {/* Validation Checklist */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1 text-[11px] text-slate-600">
                  <div className="flex items-center space-x-1.5">
                    {checks.length ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    )}
                    <span>8+ characters</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    {checks.upper && checks.lower ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    )}
                    <span>Upper & lower case</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    {checks.number ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    )}
                    <span>At least 1 number</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    {confirmPassword.length > 0 && checks.match ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    )}
                    <span>Passwords match</span>
                  </div>
                </div>
              </div>
            )}

            {/* Declaration Checkbox */}
            <div className="flex items-start pt-1">
              <div className="flex items-center h-5">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
                />
              </div>
              <div className="ml-3 text-xs text-slate-600 leading-relaxed">
                <label htmlFor="agreeTerms" className="cursor-pointer">
                  I certify that I am an actively enrolled or graduating student, and that the Student ID and Department details entered above correspond to my university records.
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || registrationSuccess}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition duration-150 ease-in-out cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                    Registering Student Account...
                  </>
                ) : registrationSuccess ? (
                  <>
                    <CheckCircle2 className="-ml-1 mr-2 h-4 w-4 text-white" />
                    Account Ready! Redirecting...
                  </>
                ) : (
                  <>
                    Complete Registration & Open Portal
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Bottom Switch to Sign In */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col items-center space-y-2">
            <p className="text-xs text-slate-500">
              Already registered your student or department account?
            </p>
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition cursor-pointer"
            >
              Sign In with College Email
              <ArrowRight className="ml-1.5 w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-slate-500">
          UniClear Department & Placement Clearance Management System &bull; Secured with Institutional Identity
        </div>
      </div>
    </div>
  );
};
