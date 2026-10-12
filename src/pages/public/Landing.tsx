import React, { useState } from 'react';
import { 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  BookOpen, 
  Receipt, 
  Home, 
  Trophy, 
  Briefcase, 
  FileCheck,
  Search,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface LandingProps {
  onNavigateToLogin: () => void;
  onNavigateToSignUp: () => void;
  onNavigateToDashboard: () => void;
  isAuthenticated: boolean;
}

export const Landing: React.FC<LandingProps> = ({
  onNavigateToLogin,
  onNavigateToSignUp,
  onNavigateToDashboard,
  isAuthenticated
}) => {
  const [certQuery, setCertQuery] = useState('');
  const [certResult, setCertResult] = useState<{ verified: boolean; message: string; details?: any } | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certQuery.trim()) return;
    
    // Quick verification check simulation
    if (certQuery.toUpperCase().startsWith('UNC-') || certQuery.length >= 6) {
      setCertResult({
        verified: true,
        message: 'Valid University Clearance Record',
        details: {
          certNo: certQuery.toUpperCase(),
          status: 'ALL CLEAR / APPROVED',
          issuedTo: 'Graduating Candidate',
          session: '2025-2026',
          departmentsCleared: '6 of 6 Cleared',
          placementStatus: 'Placement NOC Issued'
        }
      });
    } else {
      setCertResult({
        verified: false,
        message: 'No certificate found with this verification reference code.'
      });
    }
  };

  const departments = [
    { code: 'HOD', name: 'Academic Dept (HOD)', icon: GraduationCap, desc: 'Project submission, thesis approval, lab records & credits.' },
    { code: 'LIB', name: 'Central Library', icon: BookOpen, desc: 'Return of borrowed books, journals, and fine reconciliation.' },
    { code: 'ACC', name: 'Finance & Accounts', icon: Receipt, desc: 'Semester tuition fees, exam dues & caution deposit refunds.' },
    { code: 'HST', name: 'Hostel Administration', icon: Home, desc: 'Room clearance, mess charges & maintenance dues audit.' },
    { code: 'SPT', name: 'Sports & Gym Dept', icon: Trophy, desc: 'Return of university athletic equipment and gym clearance.' },
    { code: 'TNP', name: 'Placement Cell (T&P)', icon: Briefcase, desc: 'Offer letter validation & final Placement NOC generation.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Uni<span className="text-blue-600">Clear</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                Siddhartha Academy of Higher Education
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={onNavigateToDashboard}
                className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition cursor-pointer"
              >
                Go to Dashboard
                <ArrowRight className="ml-1.5 w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={onNavigateToSignUp}
                  className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition cursor-pointer"
                >
                  Student Sign Up
                  <ArrowRight className="ml-1.5 w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
              Centralized Digital Clearance & Placement NOC
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Seamless University No-Dues & Placement Clearance
            </h1>
            <p className="mt-5 text-lg text-slate-600 leading-relaxed">
              Eliminate physical clearance queues. Graduating students can track real-time departmental approvals, settle dues online, and obtain instant digital Placement NOC certificates.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={onNavigateToDashboard}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition cursor-pointer"
                >
                  Access Your Clearance Portal
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={onNavigateToSignUp}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition cursor-pointer"
                  >
                    Register as Graduating Student
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={onNavigateToLogin}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition cursor-pointer"
                  >
                    Sign In to Existing Account
                  </button>
                </>
              )}
            </div>

            {/* Quick Metrics */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-2xl font-bold text-slate-900">6</div>
                <div className="text-xs text-slate-500 font-medium mt-1">Clearing Departments</div>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-2xl font-bold text-slate-900">100%</div>
                <div className="text-xs text-slate-500 font-medium mt-1">Paperless Workflow</div>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-2xl font-bold text-slate-900">Instant</div>
                <div className="text-xs text-slate-500 font-medium mt-1">Placement NOC Pass</div>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-2xl font-bold text-slate-900">Tamper-Proof</div>
                <div className="text-xs text-slate-500 font-medium mt-1">QR Code Certificate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Department Breakdown Section */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Coordinated Multi-Department Clearance
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Each administrative office verifies student records and flags outstanding dues or issues approvals digitally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => {
              const Icon = dept.icon;
              return (
                <div 
                  key={dept.code}
                  className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition group"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">{dept.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{dept.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Campus Placement Drives Section */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
              <Briefcase className="w-3.5 h-3.5 mr-1.5" />
              Training &amp; Placement Cell (T&amp;P)
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Campus Placement Drives &amp; Hiring Partners
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Graduating students can view active job drives, apply directly, and generate verified Placement NOCs for recruiters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { company: 'Microsoft Corporation', role: 'Software Development Engineer', ctc: '44.5 LPA', tier: 'Tier-1 Product', branch: 'CSE / IT / ECE' },
              { company: 'Amazon Web Services', role: 'Cloud Support & DevOps Engineer', ctc: '28.0 LPA', tier: 'Tier-1 Product', branch: 'CSE / IT / ECE / EEE' },
              { company: 'Qualcomm India', role: 'Embedded Systems & Firmware', ctc: '22.0 LPA', tier: 'Core Engineering', branch: 'ECE / EEE / CSE' },
              { company: 'Deloitte USI', role: 'Associate Technology Consultant', ctc: '12.5 LPA', tier: 'Consulting & FinTech', branch: 'All Branches' },
              { company: 'Tata Consultancy Services', role: 'Digital Specialist Engineer', ctc: '9.0 LPA', tier: 'Mass IT Services', branch: 'All Branches' },
              { company: 'Larsen & Toubro (L&T)', role: 'Graduate Engineer Trainee (GET)', ctc: '8.5 LPA', tier: 'Core Engineering', branch: 'ME / CE / EEE / CHE' }
            ].map((drive, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      {drive.tier}
                    </span>
                    <span className="font-mono font-bold text-emerald-700 text-sm">
                      ₹ {drive.ctc}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-3">{drive.company}</h3>
                  <p className="text-xs text-slate-700 font-medium">{drive.role}</p>
                  <p className="text-[11px] text-slate-500 mt-2">Eligible: <span className="font-medium text-slate-800">{drive.branch}</span></p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-600 font-semibold flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Active on Portal
                  </span>
                  <button
                    type="button"
                    onClick={isAuthenticated ? onNavigateToDashboard : onNavigateToSignUp}
                    className="font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    Apply &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Public Certificate Verification Tool */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Verify No-Dues Clearance Certificate
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-lg mx-auto">
              Recruiters and university officials can verify any student's digital clearance credential by certificate ID.
            </p>

            <form onSubmit={handleVerify} className="mt-6 max-w-md mx-auto flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={certQuery}
                  onChange={(e) => setCertQuery(e.target.value)}
                  placeholder="e.g. UNC-2026-97EC36"
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs cursor-pointer transition"
              >
                Verify
              </button>
            </form>

            {certResult && (
              <div className={`mt-6 p-4 rounded-xl text-left border ${
                certResult.verified ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                <div className="flex items-center space-x-2 font-semibold text-sm">
                  {certResult.verified ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-rose-600" />
                  )}
                  <span>{certResult.message}</span>
                </div>
                {certResult.details && (
                  <div className="mt-3 pt-3 border-t border-emerald-200/80 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div><span className="text-slate-500">Certificate:</span> <span className="font-mono font-bold text-slate-900">{certResult.details.certNo}</span></div>
                    <div><span className="text-slate-500">Status:</span> <span className="font-bold text-emerald-700">{certResult.details.status}</span></div>
                    <div><span className="text-slate-500">Placement NOC:</span> <span className="font-bold text-blue-700">{certResult.details.placementStatus}</span></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-700">Siddhartha Academy of Higher Education</span>
            <span>&bull; Directorate of Training &amp; Placement</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Siddhartha Academy of Higher Education. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
