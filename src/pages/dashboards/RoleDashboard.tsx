import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  Download, 
  Send, 
  Search, 
  Filter, 
  CreditCard, 
  ShieldCheck, 
  Building2, 
  BookOpen, 
  Receipt, 
  Home as HomeIcon, 
  Trophy, 
  Briefcase, 
  RefreshCw, 
  Printer, 
  X, 
  ExternalLink, 
  ChevronRight, 
  Info,
  MapPin,
  Calendar,
  Users,
  Award,
  Sparkles,
  TrendingUp,
  FileCheck,
  Building
} from 'lucide-react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../hooks/useAuth';
import { 
  ClearanceRequest, 
  DepartmentCode, 
  ClearanceStatus, 
  DepartmentClearance,
  UserRole,
  PlacementDrive,
  PlacementApplication
} from '../../types';

export const RoleDashboard: React.FC = () => {
  const { user, userProfile, activeRoleOverride } = useAuth();
  const effectiveRole: UserRole = (activeRoleOverride as UserRole) || userProfile?.role || 'student';

  // Navigation Tabs for Student
  const [studentTab, setStudentTab] = useState<'clearance' | 'drives' | 'noc'>('clearance');

  // Clearance State
  const [clearanceData, setClearanceData] = useState<ClearanceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Student Modals
  const [selectedDeptForProof, setSelectedDeptForProof] = useState<DepartmentClearance | null>(null);
  const [proofNote, setProofNote] = useState('');
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [appliedSuccessModal, setAppliedSuccessModal] = useState<string | null>(null);

  // Placement Filters
  const [driveSearch, setDriveSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Officer / Admin States
  const [officerDept, setOfficerDept] = useState<DepartmentCode>('academic');
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [officerActionStudent, setOfficerActionStudent] = useState<any | null>(null);
  const [actionDueAmount, setActionDueAmount] = useState('0');
  const [actionRemarks, setActionRemarks] = useState('');

  // Initial Placement Drives Roster
  const [placementDrives, setPlacementDrives] = useState<PlacementDrive[]>([
    {
      id: 'DRV-001',
      companyName: 'Microsoft Corporation',
      category: 'Tier-1 Product',
      role: 'Software Development Engineer (SDE-1)',
      ctc: '44.5 LPA',
      location: 'Hyderabad / Bengaluru / Noida',
      eligibleBranches: ['CSE', 'IT', 'ECE'],
      minCgpa: 7.5,
      deadline: '2026-10-25',
      driveDate: '2026-10-30',
      status: 'open',
      type: 'Full-Time FTE',
      openings: 18,
      description: 'Design and build resilient, distributed cloud services on Azure and Microsoft 365 platforms.',
      hiringRounds: ['Online Coding Challenge (LeetCode Medium-Hard)', 'Technical System Design', 'Managerial Interview', 'AA Round']
    },
    {
      id: 'DRV-002',
      companyName: 'Amazon Web Services',
      category: 'Tier-1 Product',
      role: 'Cloud Support & DevOps Engineer',
      ctc: '28.0 LPA',
      location: 'Bengaluru / Hyderabad',
      eligibleBranches: ['CSE', 'IT', 'ECE', 'EEE'],
      minCgpa: 7.0,
      deadline: '2026-10-20',
      driveDate: '2026-10-24',
      status: 'shortlisting',
      type: 'Full-Time FTE',
      openings: 25,
      description: 'Architecting scalable cloud infra, linux debugging, and distributed systems troubleshooting.',
      hiringRounds: ['Amazon Online Assessment (OA)', 'Technical Bar Raiser', 'Leadership Principles Interview']
    },
    {
      id: 'DRV-003',
      companyName: 'Deloitte USI',
      category: 'Consulting & FinTech',
      role: 'Associate Technology Consultant',
      ctc: '12.5 LPA',
      location: 'Hyderabad / Mumbai / Gurugram',
      eligibleBranches: ['All Branches'],
      minCgpa: 6.5,
      deadline: '2026-10-15',
      driveDate: '2026-10-18',
      status: 'completed',
      type: 'Full-Time FTE',
      openings: 40,
      description: 'Enterprise IT transformations, cloud advisory, analytics, and ERP implementations.',
      hiringRounds: ['Cognitive Assessment', 'Versant English Test', 'Technical Case Study', 'Partner Interview']
    },
    {
      id: 'DRV-004',
      companyName: 'Qualcomm India',
      category: 'Core Engineering',
      role: 'Embedded Systems & Firmware Engineer',
      ctc: '22.0 LPA',
      location: 'Bengaluru / Chennai',
      eligibleBranches: ['ECE', 'EEE', 'CSE'],
      minCgpa: 7.5,
      deadline: '2026-11-05',
      driveDate: '2026-11-10',
      status: 'upcoming',
      type: 'Full-Time FTE',
      openings: 12,
      description: '5G modem software, Snapdragon processor low-level driver development and RTOS architecture.',
      hiringRounds: ['C/C++ & Microcontroller MCQs', 'Embedded Coding', 'Hardware Architecture Round', 'HR Interview']
    },
    {
      id: 'DRV-005',
      companyName: 'Tata Consultancy Services (TCS)',
      category: 'Mass IT Services',
      role: 'TCS Digital Cadre Specialist',
      ctc: '9.0 LPA',
      location: 'Pan India',
      eligibleBranches: ['All Branches'],
      minCgpa: 6.0,
      deadline: '2026-11-02',
      driveDate: '2026-11-08',
      status: 'open',
      type: 'Full-Time FTE',
      openings: 85,
      description: 'Full stack development, cloud migration, AI/ML proofs of concept and client delivery.',
      hiringRounds: ['TCS NQT Advanced Test', 'Coding Round', 'Technical & HR Discussion']
    },
    {
      id: 'DRV-006',
      companyName: 'Larsen & Toubro (L&T)',
      category: 'Core Engineering',
      role: 'Graduate Engineer Trainee (GET)',
      ctc: '8.5 LPA',
      location: 'Mumbai / Chennai / Vadodara',
      eligibleBranches: ['ME', 'CE', 'EEE', 'CHE'],
      minCgpa: 6.5,
      deadline: '2026-10-28',
      driveDate: '2026-11-02',
      status: 'open',
      type: 'Full-Time FTE',
      openings: 30,
      description: 'Heavy engineering, EPC project management, automated manufacturing and smart grid infrastructure.',
      hiringRounds: ['Aptitude & Technical Core Test', 'Group Discussion', 'Technical Panel', 'Medical & HR']
    }
  ]);

  // Student Placement Applications
  const [myApplications, setMyApplications] = useState<PlacementApplication[]>([
    {
      id: 'APP-101',
      driveId: 'DRV-003',
      companyName: 'Deloitte USI',
      role: 'Associate Technology Consultant',
      ctc: '12.5 LPA',
      appliedDate: '2026-09-28',
      status: 'Selected',
      offerLetterSubmitted: true
    },
    {
      id: 'APP-102',
      driveId: 'DRV-002',
      companyName: 'Amazon Web Services',
      role: 'Cloud Support & DevOps Engineer',
      ctc: '28.0 LPA',
      appliedDate: '2026-10-02',
      status: 'Technical Interview',
      offerLetterSubmitted: false
    }
  ]);

  // Sample student database for Officer & Admin view
  const [adminStudents, setAdminStudents] = useState<any[]>([
    {
      id: 'STU-2022-CSE-084',
      name: userProfile?.displayName || 'Aarav Sharma',
      email: userProfile?.email || 'aarav.sharma@university.edu',
      rollNo: userProfile?.studentId || '2022-CSE-084',
      department: userProfile?.department || 'Computer Science & Engineering',
      degree: 'B.Tech CSE',
      overallStatus: 'pending',
      dueTotal: 0,
      clearedCount: 4,
      placedCompany: 'Deloitte USI (12.5 LPA)',
      departments: {
        academic: { status: 'approved', remarks: 'Major project thesis accepted & credits verified', due: 0 },
        library: { status: 'pending', remarks: 'Awaiting return of 1 reference textbook (Digital Electronics)', due: 150 },
        accounts: { status: 'approved', remarks: 'Full 8 semesters tuition cleared', due: 0 },
        hostel: { status: 'approved', remarks: 'Room handover receipt signed by warden', due: 0 },
        sports: { status: 'approved', remarks: 'Gym membership closed, equipment returned', due: 0 },
        placement: { status: 'approved', remarks: 'Deloitte Placement Offer verified. T&P clearance approved.', due: 0 },
      }
    },
    {
      id: 'STU-2022-ECE-019',
      name: 'Priya Narang',
      email: 'priya.n@university.edu',
      rollNo: '2022-ECE-019',
      department: 'Electronics & Communication Engineering (ECE)',
      degree: 'B.Tech ECE',
      overallStatus: 'approved',
      dueTotal: 0,
      clearedCount: 6,
      placedCompany: 'Microsoft (44.5 LPA)',
      departments: {
        academic: { status: 'approved', remarks: 'All credits confirmed', due: 0 },
        library: { status: 'approved', remarks: 'No books overdue', due: 0 },
        accounts: { status: 'approved', remarks: 'Caution deposit settled', due: 0 },
        hostel: { status: 'approved', remarks: 'Hostel dues cleared', due: 0 },
        sports: { status: 'approved', remarks: 'Clear', due: 0 },
        placement: { status: 'approved', remarks: 'T&P NOC issued for Microsoft Offer', due: 0 },
      }
    },
    {
      id: 'STU-2022-ME-052',
      name: 'Rohan Deshmukh',
      email: 'rohan.d@university.edu',
      rollNo: '2022-ME-052',
      department: 'Mechanical Engineering (ME)',
      degree: 'B.Tech ME',
      overallStatus: 'pending',
      dueTotal: 850,
      clearedCount: 3,
      placedCompany: 'Larsen & Toubro (8.5 LPA)',
      departments: {
        academic: { status: 'pending', remarks: 'Workshop tool damage fee pending', due: 500 },
        library: { status: 'approved', remarks: 'Cleared', due: 0 },
        accounts: { status: 'pending', remarks: 'Library & workshop fine aggregation', due: 350 },
        hostel: { status: 'approved', remarks: 'Day Scholar (N/A)', due: 0 },
        sports: { status: 'approved', remarks: 'Clear', due: 0 },
        placement: { status: 'pending', remarks: 'Dues outstanding in Workshop and Accounts', due: 0 },
      }
    }
  ]);

  // Load student clearance doc from Firestore
  const loadClearance = async () => {
    if (!user) return;
    try {
      const docRef = doc(db, 'clearance_requests', user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setClearanceData(snap.data() as ClearanceRequest);
      } else {
        const initialDoc: ClearanceRequest = {
          id: user.uid,
          studentUid: user.uid,
          studentName: userProfile?.displayName || user.displayName || 'Graduating Student',
          studentEmail: user.email || '',
          studentId: userProfile?.studentId || '2022-CSE-084',
          studentDepartment: userProfile?.department || 'Computer Science & Engineering',
          academicYear: '2025-2026',
          degree: 'Bachelor of Technology (B.Tech)',
          submissionDate: new Date().toISOString().split('T')[0],
          overallStatus: 'pending',
          departments: {
            academic: {
              departmentCode: 'academic',
              departmentName: 'Academic Department (HOD)',
              status: 'pending',
              dueAmount: 0,
              remarks: 'Awaiting faculty advisor signature on project report.'
            },
            library: {
              departmentCode: 'library',
              departmentName: 'Central University Library',
              status: 'pending',
              dueAmount: 150,
              remarks: 'Overdue fine for Computer Networks reference textbook (Due: ₹150).'
            },
            accounts: {
              departmentCode: 'accounts',
              departmentName: 'Finance & Accounts Division',
              status: 'approved',
              dueAmount: 0,
              remarks: 'Tuition fees reconciled. Caution deposit refund queued.'
            },
            hostel: {
              departmentCode: 'hostel',
              departmentName: 'Hostel & Residence Office',
              status: 'approved',
              dueAmount: 0,
              remarks: 'Room inventory handed over to block warden.'
            },
            sports: {
              departmentCode: 'sports',
              departmentName: 'Sports & Physical Education Dept',
              status: 'approved',
              dueAmount: 0,
              remarks: 'Gym membership expired normally. No equipment pending.'
            },
            placement: {
              departmentCode: 'placement',
              departmentName: 'Training & Placement Cell (T&P)',
              status: 'approved',
              dueAmount: 0,
              remarks: 'Deloitte Offer Letter verified. T&P Clearance granted for Placement NOC.'
            }
          },
          placementNocEligible: false,
          certificateNumber: `UNC-2026-${user.uid.substring(0, 6).toUpperCase()}`,
          updatedAt: new Date().toISOString()
        };
        await setDoc(docRef, initialDoc);
        setClearanceData(initialDoc);
      }
    } catch (err) {
      console.warn('Error loading clearance doc:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadClearance();
  }, [user, userProfile]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadClearance();
  };

  // Student applies to a placement drive
  const handleApplyDrive = (drive: PlacementDrive) => {
    const existing = myApplications.find(a => a.driveId === drive.id);
    if (existing) {
      alert(`You have already applied for ${drive.companyName} (${drive.role}). Current Status: ${existing.status}`);
      return;
    }

    const newApp: PlacementApplication = {
      id: `APP-${Date.now().toString().slice(-4)}`,
      driveId: drive.id,
      companyName: drive.companyName,
      role: drive.role,
      ctc: drive.ctc,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      offerLetterSubmitted: false
    };

    setMyApplications(prev => [newApp, ...prev]);
    setAppliedSuccessModal(`Application successfully submitted for ${drive.companyName} (${drive.role})! Hall ticket & online test link will be emailed 24 hours prior to the drive date.`);
  };

  // Submit proof note or explanation from student
  const handleSaveProof = async () => {
    if (!selectedDeptForProof || !clearanceData || !user) return;
    
    const updatedDepartments = {
      ...clearanceData.departments,
      [selectedDeptForProof.departmentCode]: {
        ...selectedDeptForProof,
        status: 'in_review' as ClearanceStatus,
        proofSubmitted: proofNote,
        remarks: `Student submitted clarification: "${proofNote}". Awaiting officer re-review.`
      }
    };

    const updatedData: ClearanceRequest = {
      ...clearanceData,
      departments: updatedDepartments,
      updatedAt: new Date().toISOString()
    };

    try {
      await updateDoc(doc(db, 'clearance_requests', user.uid), {
        departments: updatedDepartments,
        updatedAt: new Date().toISOString()
      });
      setClearanceData(updatedData);
    } catch (e) {
      setClearanceData(updatedData);
    }

    setSelectedDeptForProof(null);
    setProofNote('');
  };

  // Department Officer approves or updates student status
  const handleOfficerUpdate = (approved: boolean) => {
    if (!officerActionStudent) return;

    setAdminStudents(prev => prev.map(s => {
      if (s.id === officerActionStudent.id) {
        const currentDept = s.departments[officerDept];
        const newStatus = approved ? 'approved' : 'rejected';
        const newRemarks = actionRemarks.trim() || (approved ? 'No pending dues. Clearance granted.' : 'Outstanding requirement pending.');
        const newDue = approved ? 0 : parseFloat(actionDueAmount || '0');

        const updatedDepts = {
          ...s.departments,
          [officerDept]: {
            ...currentDept,
            status: newStatus,
            remarks: newRemarks,
            due: newDue
          }
        };

        const clearedCount = Object.values(updatedDepts).filter((d: any) => d.status === 'approved').length;
        const overallStatus = clearedCount === 6 ? 'approved' : 'pending';

        return {
          ...s,
          departments: updatedDepts,
          clearedCount,
          overallStatus,
          dueTotal: Object.values(updatedDepts).reduce((acc: number, curr: any) => acc + (curr.due || 0), 0)
        };
      }
      return s;
    }));

    setOfficerActionStudent(null);
    setActionRemarks('');
    setActionDueAmount('0');
  };

  // Compute student stats
  const departmentsList: DepartmentClearance[] = clearanceData 
    ? Object.values(clearanceData.departments) 
    : [];

  const approvedCount = departmentsList.filter(d => d.status === 'approved').length;
  const totalDues = departmentsList.reduce((acc, curr) => acc + (curr.dueAmount || 0), 0);
  const isFullyCleared = approvedCount === 6;

  const departmentIcons: Record<DepartmentCode, any> = {
    academic: GraduationCap,
    library: BookOpen,
    accounts: Receipt,
    hostel: HomeIcon,
    sports: Trophy,
    placement: Briefcase
  };

  // Filtered placement drives
  const filteredDrives = placementDrives.filter(drive => {
    const matchesSearch = drive.companyName.toLowerCase().includes(driveSearch.toLowerCase()) ||
                          drive.role.toLowerCase().includes(driveSearch.toLowerCase()) ||
                          drive.location.toLowerCase().includes(driveSearch.toLowerCase());
    const matchesBranch = branchFilter === 'All' || 
                          drive.eligibleBranches.includes('All Branches') || 
                          drive.eligibleBranches.some(b => b.toLowerCase().includes(branchFilter.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || drive.category === categoryFilter;
    return matchesSearch && matchesBranch && matchesCategory;
  });

  const selectedOffer = myApplications.find(a => a.status === 'Selected');

  /* =========================================================================
     1. STUDENT DASHBOARD VIEW
     ========================================================================= */
  if (effectiveRole === 'student') {
    return (
      <div className="space-y-8 animate-fadeIn">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-blue-50/70 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Graduating Student Clearance &bull; Batch 2022-2026</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Welcome, {userProfile?.displayName || user?.displayName || 'Student'}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                <div><span className="text-slate-400">Roll No:</span> <strong className="font-mono text-slate-800">{userProfile?.studentId || '2022-CSE-084'}</strong></div>
                <div>&bull;</div>
                <div><span className="text-slate-400">Department:</span> <strong className="text-slate-800">{userProfile?.department || 'Computer Science & Engineering'}</strong></div>
                <div>&bull;</div>
                <div><span className="text-slate-400">Placement:</span> <strong className="text-emerald-700 font-bold">{selectedOffer ? `${selectedOffer.companyName} (${selectedOffer.ctc})` : 'Active in Drives'}</strong></div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center transition cursor-pointer"
                title="Refresh latest status from university database"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              
              <button
                type="button"
                onClick={() => setShowCertificateModal(true)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center shadow-md shadow-blue-500/20 transition cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 mr-1.5" />
                Certificate &amp; Pass
              </button>
            </div>
          </div>

          {/* MAIN TABS SWITCHER: Placements vs No-Dues Clearance */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setStudentTab('clearance')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center cursor-pointer ${
                studentTab === 'clearance'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileCheck className="w-4 h-4 mr-1.5" />
              Department No-Dues Clearance ({approvedCount}/6 Cleared)
            </button>

            <button
              type="button"
              onClick={() => setStudentTab('drives')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center cursor-pointer ${
                studentTab === 'drives'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Briefcase className="w-4 h-4 mr-1.5" />
              Campus Placements &amp; Job Drives ({placementDrives.length} Active)
            </button>

            <button
              type="button"
              onClick={() => setStudentTab('noc')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center cursor-pointer ${
                studentTab === 'noc'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Award className="w-4 h-4 mr-1.5" />
              Placement Offer &amp; NOC Pass
            </button>
          </div>
        </div>

        {/* =========================================================================
            TAB 1: CAMPUS PLACEMENTS & JOB DRIVES
            ========================================================================= */}
        {studentTab === 'drives' && (
          <div className="space-y-6">
            
            {/* Placement Cell Highlights Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                <div className="text-xs text-slate-500 font-medium">Placement Batch</div>
                <div className="mt-1 text-xl font-bold text-slate-900">2025 – 2026</div>
                <div className="text-[11px] text-emerald-600 font-medium mt-0.5">86% Batch Placed</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                <div className="text-xs text-slate-500 font-medium">Highest Package</div>
                <div className="mt-1 text-xl font-bold text-emerald-600 font-mono">44.5 LPA</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Microsoft India</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                <div className="text-xs text-slate-500 font-medium">Average Package</div>
                <div className="mt-1 text-xl font-bold text-blue-600 font-mono">9.8 LPA</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Across All Branches</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                <div className="text-xs text-slate-500 font-medium">My Offer Status</div>
                <div className="mt-1 text-lg font-bold text-emerald-700 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />
                  Placed (Deloitte)
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">12.5 LPA (FTE)</div>
              </div>
            </div>

            {/* My Applied Drives Status Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <h2 className="text-base font-bold text-slate-900">
                    My Applied Placement Drives &amp; Selection Status
                  </h2>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {myApplications.length} Applications Active
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3">Company Name</th>
                      <th className="px-4 py-3">Job Role</th>
                      <th className="px-4 py-3">Package (CTC)</th>
                      <th className="px-4 py-3">Applied Date</th>
                      <th className="px-4 py-3">Current Round / Status</th>
                      <th className="px-4 py-3 text-right">Offer &amp; NOC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3.5 font-bold text-slate-900 flex items-center">
                          <Building className="w-3.5 h-3.5 mr-2 text-slate-400" />
                          {app.companyName}
                        </td>
                        <td className="px-4 py-3.5 text-slate-700 font-medium">{app.role}</td>
                        <td className="px-4 py-3.5 font-mono font-bold text-emerald-700">{app.ctc}</td>
                        <td className="px-4 py-3.5 text-slate-500">{app.appliedDate}</td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            app.status === 'Selected'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {app.status === 'Selected' ? (
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                            ) : (
                              <Clock className="w-3 h-3 mr-1" />
                            )}
                            {app.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          {app.status === 'Selected' ? (
                            <button
                              type="button"
                              onClick={() => setStudentTab('noc')}
                              className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition cursor-pointer"
                            >
                              View Offer &amp; NOC
                            </button>
                          ) : (
                            <span className="text-slate-400 text-[11px]">In Progress</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Placement Drives Directory */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Active &amp; Upcoming Campus Placement Drives
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Explore visiting companies, packages, and eligibility criteria verified by the Training &amp; Placement Cell.
                  </p>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search company or role..."
                      value={driveSearch}
                      onChange={(e) => setDriveSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>

                  <select
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                    className="py-1.5 px-2.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700"
                  >
                    <option value="All">All Branches</option>
                    <option value="CSE">CSE / IT</option>
                    <option value="ECE">ECE / EEE</option>
                    <option value="ME">Mechanical (ME)</option>
                    <option value="CE">Civil (CE)</option>
                  </select>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="py-1.5 px-2.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700"
                  >
                    <option value="All">All Tiers</option>
                    <option value="Tier-1 Product">Tier-1 Product</option>
                    <option value="Core Engineering">Core Engineering</option>
                    <option value="Consulting & FinTech">Consulting &amp; FinTech</option>
                    <option value="Mass IT Services">Mass IT Services</option>
                  </select>
                </div>
              </div>

              {/* Drives Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
                {filteredDrives.map((drive) => {
                  const hasApplied = myApplications.some(a => a.driveId === drive.id);
                  const isSelected = myApplications.some(a => a.driveId === drive.id && a.status === 'Selected');

                  return (
                    <div 
                      key={drive.id}
                      className="bg-slate-50/60 rounded-2xl p-5 border border-slate-200/90 hover:border-blue-300 hover:bg-white transition flex flex-col justify-between"
                    >
                      <div>
                        {/* Company & Category */}
                        <div className="flex items-start justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                            {drive.category}
                          </span>
                          <span className="font-mono font-bold text-emerald-700 text-sm bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            ₹ {drive.ctc}
                          </span>
                        </div>

                        <h3 className="mt-3 text-base font-bold text-slate-900">
                          {drive.companyName}
                        </h3>
                        <p className="text-xs font-semibold text-slate-700 mt-0.5">
                          {drive.role}
                        </p>

                        <p className="mt-2 text-xs text-slate-600 line-clamp-2">
                          {drive.description}
                        </p>

                        {/* Drive Details */}
                        <div className="mt-3.5 pt-3 border-t border-slate-200/80 space-y-1.5 text-[11px] text-slate-600">
                          <div className="flex items-center">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
                            <span className="truncate">{drive.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
                            <span>Drive Date: <strong>{drive.driveDate}</strong> (Deadline: {drive.deadline})</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
                            <span>Openings: <strong>{drive.openings} positions</strong> &bull; Min CGPA: <strong>{drive.minCgpa}</strong></span>
                          </div>
                        </div>

                        {/* Eligible Branches Badges */}
                        <div className="mt-3 flex flex-wrap gap-1">
                          {drive.eligibleBranches.map((b) => (
                            <span key={b} className="text-[10px] px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded">
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between">
                        {isSelected ? (
                          <div className="w-full text-center py-2 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 mr-1.5" />
                            Selected / Offer Accepted
                          </div>
                        ) : hasApplied ? (
                          <div className="w-full text-center py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl border border-blue-200 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 mr-1.5" />
                            Already Applied
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleApplyDrive(drive)}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-xs flex items-center justify-center cursor-pointer"
                          >
                            Apply for Drive
                            <ChevronRight className="w-3.5 h-3.5 ml-1" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: PLACEMENT OFFER & NOC PASS
            ========================================================================= */}
        {studentTab === 'noc' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Training &amp; Placement Cell (T&amp;P) NOC &amp; Offer Verification
                  </h2>
                  <p className="text-xs text-slate-500">
                    Official No Objection Certificate (NOC) granted for recruiter onboarding and degree clearance.
                  </p>
                </div>
              </div>

              {/* Offer Details Box */}
              {selectedOffer ? (
                <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-200/80">
                    <div>
                      <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                        Confirmed Campus Placement Offer:
                      </div>
                      <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                        {selectedOffer.companyName}
                      </div>
                      <div className="text-xs text-slate-600">
                        Role: <strong>{selectedOffer.role}</strong> &bull; CTC: <strong className="font-mono text-emerald-800">{selectedOffer.ctc}</strong>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-200 text-emerald-900 flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Verified by T&amp;P Cell
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
                    <div>
                      <span className="text-slate-500">Candidate Name:</span>
                      <div className="font-semibold text-slate-900">{userProfile?.displayName || user?.displayName}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Student Roll No:</span>
                      <div className="font-mono font-semibold text-slate-900">{userProfile?.studentId || '2022-CSE-084'}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Joining Session:</span>
                      <div className="font-semibold text-slate-900">July 2026 Batch</div>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-emerald-200/70 text-xs text-slate-600 flex items-start space-x-2">
                    <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Placement NOC Clearance Notice:</strong> The university Training &amp; Placement Cell has endorsed this offer. All six institutional departments (Academic, Library, Accounts, Hostel, Sports, and T&amp;P) must complete clearance to release the final verifiable certificate below.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-2">
                  <p className="font-bold">No Verified Placement Offer Attached Yet</p>
                  <p>
                    Go to the <strong>Campus Placements &amp; Job Drives</strong> tab to apply for open campus drives. If you have secured an off-campus offer, submit your offer letter to the T&amp;P office for verification.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setShowCertificateModal(true)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center shadow-sm cursor-pointer"
                >
                  <Printer className="w-4 h-4 mr-1.5" />
                  Print / Download University Clearance &amp; NOC Pass
                </button>
                <button
                  type="button"
                  onClick={() => setStudentTab('clearance')}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Check Remaining Department Dues
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: DEPARTMENT NO-DUES CLEARANCE (The 6 Departments)
            ========================================================================= */}
        {studentTab === 'clearance' && (
          <div className="space-y-6">
            
            {/* Dues & Alert Summary Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 font-medium">Clearance Progress</div>
                  <div className="mt-1 text-lg font-bold flex items-center space-x-2">
                    {isFullyCleared ? (
                      <span className="text-emerald-600 flex items-center">
                        <CheckCircle2 className="w-5 h-5 mr-1.5" /> Fully Cleared
                      </span>
                    ) : (
                      <span className="text-amber-600 flex items-center">
                        <Clock className="w-5 h-5 mr-1.5" /> {approvedCount} of 6 Cleared
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                  {approvedCount}/6
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 font-medium">Outstanding Dues Total</div>
                  <div className="mt-1 text-xl font-bold font-mono text-slate-900">
                    {totalDues > 0 ? (
                      <span className="text-rose-600">₹{totalDues.toFixed(2)}</span>
                    ) : (
                      <span className="text-emerald-600">₹0.00 (Nil)</span>
                    )}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 font-medium">Placement NOC Eligibility</div>
                  <div className="mt-1 text-base font-bold text-slate-900">
                    {isFullyCleared ? (
                      <span className="text-emerald-600">Eligible for Issuance</span>
                    ) : (
                      <span className="text-slate-500">Requires 6/6 Approvals</span>
                    )}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* 6 Department Clearance Cards */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">
                  Department Clearance Ledger
                </h2>
                <span className="text-xs text-slate-500">
                  Click "Submit Proof / Re-check" to contact the department officer.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {departmentsList.map((dept) => {
                  const Icon = departmentIcons[dept.departmentCode] || Building2;
                  
                  const isApproved = dept.status === 'approved';
                  const isInReview = dept.status === 'in_review';
                  const isRejected = dept.status === 'rejected';

                  return (
                    <div 
                      key={dept.departmentCode}
                      className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-blue-300 transition"
                    >
                      <div>
                        {/* Top Icon & Status Badge */}
                        <div className="flex items-start justify-between">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            {isApproved && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approved
                              </span>
                            )}
                            {isInReview && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                <Clock className="w-3.5 h-3.5 mr-1" /> In Re-Review
                              </span>
                            )}
                            {!isApproved && !isInReview && !isRejected && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                                <Clock className="w-3.5 h-3.5 mr-1" /> Pending
                              </span>
                            )}
                            {isRejected && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                                <XCircle className="w-3.5 h-3.5 mr-1" /> Action Required
                              </span>
                            )}
                          </div>
                        </div>

                        <h3 className="mt-3 text-base font-bold text-slate-900 leading-snug">
                          {dept.departmentName}
                        </h3>

                        {/* Department Remarks */}
                        <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                          <div className="font-semibold text-slate-500 text-[10px] uppercase tracking-wider mb-1">
                            Department Officer Remarks:
                          </div>
                          <p className="leading-relaxed">
                            {dept.remarks || 'No remarks recorded.'}
                          </p>
                        </div>

                        {/* Due Amount */}
                        <div className="mt-3 flex items-center justify-between text-xs">
                          <span className="text-slate-500 font-medium">Pending Dues:</span>
                          <span className={`font-mono font-bold ${dept.dueAmount > 0 ? 'text-rose-600 text-sm' : 'text-emerald-700'}`}>
                            {dept.dueAmount > 0 ? `₹${dept.dueAmount.toFixed(2)}` : 'Nil (₹0.00)'}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDeptForProof(dept);
                            setProofNote(dept.proofSubmitted || '');
                          }}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition flex items-center cursor-pointer"
                        >
                          Submit Proof / Re-check
                          <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                        </button>
                        {isApproved && (
                          <span className="text-[11px] text-slate-400 font-medium">Clearance locked</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Application Success Modal */}
        {appliedSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center space-x-2 text-emerald-600 mb-3">
                <CheckCircle2 className="w-6 h-6" />
                <h3 className="text-base font-bold text-slate-900">Application Submitted!</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {appliedSuccessModal}
              </p>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setAppliedSuccessModal(null)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Great, Got It
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Student Proof Modal */}
        {selectedDeptForProof && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-base">
                    {selectedDeptForProof.departmentName}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDeptForProof(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-4 text-xs">
                <div className="p-3 bg-blue-50 text-blue-900 rounded-xl">
                  <strong>Current Department Status: </strong>
                  <span className="capitalize">{selectedDeptForProof.status.replace('_', ' ')}</span>
                  {selectedDeptForProof.dueAmount > 0 && (
                    <span className="ml-2 text-rose-700 font-bold">
                      (Outstanding: ₹{selectedDeptForProof.dueAmount})
                    </span>
                  )}
                  <p className="mt-1 text-slate-600">{selectedDeptForProof.remarks}</p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Clarification / Proof Details:
                  </label>
                  <textarea
                    rows={4}
                    value={proofNote}
                    onChange={(e) => setProofNote(e.target.value)}
                    placeholder="e.g. Returned the library book to counter #2 on Friday, Receipt No: LIB-9021. Please re-verify."
                    className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedDeptForProof(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProof}
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition cursor-pointer"
                >
                  Submit for Re-evaluation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Printable Clearance Certificate Modal */}
        {showCertificateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-slate-300 relative my-8">
              
              <button
                type="button"
                onClick={() => setShowCertificateModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Certificate Border Frame */}
              <div className="border-4 border-double border-slate-800 p-6 rounded-lg text-slate-900 font-serif">
                <div className="text-center pb-4 border-b border-slate-300">
                  <div className="flex justify-center mb-2">
                    <div className="w-14 h-14 bg-blue-700 text-white rounded-2xl flex items-center justify-center shadow-md">
                      <GraduationCap className="w-9 h-9" />
                    </div>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-slate-900 font-serif">
                    Siddhartha Academy of Higher Education
                  </h2>
                  <p className="text-[11px] uppercase tracking-widest text-slate-600 font-sans mt-0.5">
                    Deemed-to-be-University &bull; Accr. NAAC &bull; UGC Approved
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-blue-800 font-sans font-semibold">
                    Directorate of Training &amp; Placement &bull; Office of the Registrar
                  </p>
                  <h3 className="mt-3 text-base sm:text-lg font-bold text-blue-900 underline uppercase tracking-wide">
                    Consolidated No-Dues Clearance &amp; Placement NOC Pass
                  </h3>
                </div>

                <div className="py-6 text-xs sm:text-sm space-y-4 leading-relaxed">
                  <p>
                    This is to officially certify that candidate <strong>{userProfile?.displayName || user?.displayName}</strong>, bearing University Roll Number <strong className="font-mono text-blue-900">{userProfile?.studentId || '2022-CSE-084'}</strong>, enrolled in the academic program <strong>{clearanceData?.degree || 'Bachelor of Technology (B.Tech)'}</strong> in the Department of <strong>{userProfile?.department || 'Computer Science & Engineering'}</strong>, <strong>Siddhartha Academy of Higher Education</strong>, has completed the mandatory graduation clearance procedure.
                  </p>

                  {/* Confirmed Placement Notice */}
                  {selectedOffer && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-sans text-emerald-900 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-emerald-800">Verified Campus Placement:</span>{' '}
                        <strong>{selectedOffer.companyName}</strong> &bull; {selectedOffer.role}
                      </div>
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        CTC: {selectedOffer.ctc}
                      </span>
                    </div>
                  )}

                  <div className="my-4 p-4 bg-slate-50 rounded-xl border border-slate-200 font-sans text-xs">
                    <div className="font-bold text-slate-700 mb-2 uppercase text-[10px] tracking-wider">
                      Siddhartha Academy Statutory Department Clearance Status:
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {departmentsList.map(d => (
                        <div key={d.departmentCode} className="flex justify-between border-b border-slate-200 pb-1">
                          <span className="text-slate-600">{d.departmentName.split('(')[0]}:</span>
                          <span className={`font-bold uppercase ${d.status === 'approved' ? 'text-emerald-700' : 'text-amber-600'}`}>
                            {d.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p>
                    {isFullyCleared ? (
                      <span className="text-emerald-800 font-bold">
                        STATUS: ALL DUES DULY CLEARED. Siddhartha Academy of Higher Education hereby grants unconditional No Objection Certificate (NOC) for corporate onboarding, degree conferral, and final migration release.
                      </span>
                    ) : (
                      <span className="text-amber-800">
                        STATUS: PROVISIONAL DRAFT. All six institutional clearance desks must record complete sign-offs prior to final convocation award.
                      </span>
                    )}
                  </p>
                </div>

                {/* Signatures & Seal */}
                <div className="mt-8 pt-6 border-t border-slate-300 grid grid-cols-3 gap-4 text-center text-xs font-sans">
                  <div>
                    <div className="font-mono text-[9px] text-slate-400 mb-2">DIGITALLY VERIFIED</div>
                    <div className="font-bold text-slate-800">Head of Department</div>
                    <div className="text-[10px] text-slate-500 truncate">{userProfile?.department}</div>
                    <div className="text-[9px] text-slate-400">Siddhartha Academy</div>
                  </div>
                  <div>
                    <div className="w-20 h-20 mx-auto rounded-full border-2 border-dashed border-blue-700 flex flex-col items-center justify-center p-1 text-center bg-blue-50/40">
                      <span className="text-[7px] font-black text-blue-900 tracking-tighter uppercase">SIDDHARTHA ACADEMY</span>
                      <span className="text-[6px] font-semibold text-blue-700">OF HIGHER EDUCATION</span>
                      <span className="text-[6px] font-bold text-slate-500 uppercase mt-0.5">OFFICIAL SEAL</span>
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[9px] text-slate-400 mb-2">DIGITALLY VERIFIED</div>
                    <div className="font-bold text-slate-800">Director, T&amp;P Cell</div>
                    <div className="text-[10px] text-slate-500">Corporate Relations</div>
                    <div className="text-[9px] text-slate-400">Siddhartha Academy</div>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-200 flex flex-col sm:flex-row justify-between text-[10px] text-slate-500 font-sans gap-1">
                  <span>Certificate ID: <strong className="font-mono text-slate-800">SAHE-2026-{(userProfile?.studentId || 'CSE084').replace(/[^a-zA-Z0-9]/g, '')}</strong></span>
                  <span>Issuing Body: Siddhartha Academy of Higher Education</span>
                  <span>Issued Date: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCertificateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 mr-1.5" />
                  Print / Save as PDF
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    );
  }

  /* =========================================================================
     2. DEPARTMENT OFFICER DASHBOARD VIEW
     ========================================================================= */
  if (effectiveRole === 'department_officer') {
    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Officer Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>Department Clearance Desk</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Department Approvals Desk
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Review graduating student no-dues petitions, reconcile outstanding dues, and issue clearance sign-offs.
            </p>
          </div>

          {/* Department Switcher */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-600">Reviewing Office:</span>
            <select
              value={officerDept}
              onChange={(e) => setOfficerDept(e.target.value as DepartmentCode)}
              className="py-2 px-3 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="academic">Academic / HOD</option>
              <option value="library">Central Library</option>
              <option value="accounts">Finance &amp; Accounts</option>
              <option value="hostel">Hostels &amp; Mess</option>
              <option value="sports">Sports &amp; Gym</option>
              <option value="placement">Training &amp; Placement Cell</option>
            </select>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by student roll number or name..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 text-xs border border-slate-300 rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Outstanding Dues</option>
            </select>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-sm">
              Student Clearance Queue &bull; <span className="capitalize">{officerDept}</span>
            </h2>
            <span className="text-xs text-slate-500">
              {adminStudents.length} Students in registry
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">Roll No</th>
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">Placement Record</th>
                  <th className="px-6 py-3">Dept Clearance</th>
                  <th className="px-6 py-3">Outstanding Due</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {adminStudents
                  .filter(s => {
                    const matchText = s.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
                                      s.rollNo.toLowerCase().includes(searchFilter.toLowerCase());
                    const deptStatus = s.departments[officerDept]?.status;
                    const matchStatus = statusFilter === 'all' || deptStatus === statusFilter;
                    return matchText && matchStatus;
                  })
                  .map((student) => {
                    const deptData = student.departments[officerDept] || { status: 'pending', due: 0, remarks: '' };
                    return (
                      <tr key={student.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-6 py-4 font-mono font-bold text-slate-900">{student.rollNo}</td>
                        <td className="px-6 py-4 font-medium text-slate-900">{student.name}</td>
                        <td className="px-6 py-4 text-slate-600">{student.department}</td>
                        <td className="px-6 py-4 font-semibold text-emerald-700">{student.placedCompany || 'Seeking'}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            deptData.status === 'approved' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : deptData.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {deptData.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono font-semibold">
                          {deptData.due > 0 ? (
                            <span className="text-rose-600">₹{deptData.due}</span>
                          ) : (
                            <span className="text-emerald-700">₹0</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setOfficerActionStudent(student);
                              setActionRemarks(deptData.remarks || '');
                              setActionDueAmount(String(deptData.due || '0'));
                            }}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg text-xs transition cursor-pointer"
                          >
                            Update Clearance
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Officer Action Modal */}
        {officerActionStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base">
                  Update Clearance &bull; {officerActionStudent.rollNo}
                </h3>
                <button
                  type="button"
                  onClick={() => setOfficerActionStudent(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-4 text-xs">
                <div>
                  <span className="text-slate-500">Student:</span> <strong>{officerActionStudent.name}</strong> ({officerActionStudent.department})
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Outstanding Due Amount (₹):
                  </label>
                  <input
                    type="number"
                    value={actionDueAmount}
                    onChange={(e) => setActionDueAmount(e.target.value)}
                    placeholder="0"
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">Set to 0 if all dues are cleared.</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Department Remarks / Rejection Reason:
                  </label>
                  <textarea
                    rows={3}
                    value={actionRemarks}
                    onChange={(e) => setActionRemarks(e.target.value)}
                    placeholder="e.g. Cleared all library fines and returned all textbooks."
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-between space-x-2">
                <button
                  type="button"
                  onClick={() => handleOfficerUpdate(false)}
                  className="px-3.5 py-2 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl transition cursor-pointer"
                >
                  Flag Dues / Reject
                </button>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setOfficerActionStudent(null)}
                    className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOfficerUpdate(true)}
                    className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition cursor-pointer"
                  >
                    Grant Approval (Clear)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* =========================================================================
     3. ADMINISTRATOR AUDIT DASHBOARD VIEW
     ========================================================================= */
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Admin Metrics Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="inline-flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Institutional Administration &amp; Audit</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          Campus Placement &amp; Clearance Administration Ledger
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          High-level institutional oversight across all 6 clearance offices, university placement eligibility, and student accounts.
        </p>

        {/* Key KPI Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-500 font-semibold">Total Students</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{adminStudents.length}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Graduating Class</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-500 font-semibold">Fully Cleared (100%)</div>
            <div className="mt-1 text-2xl font-bold text-emerald-600">
              {adminStudents.filter(s => s.overallStatus === 'approved').length}
            </div>
            <div className="text-[11px] text-emerald-700 mt-0.5">Placement NOC Ready</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-500 font-semibold">Pending Clearances</div>
            <div className="mt-1 text-2xl font-bold text-amber-600">
              {adminStudents.filter(s => s.overallStatus !== 'approved').length}
            </div>
            <div className="text-[11px] text-amber-700 mt-0.5">Departments Reviewing</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-500 font-semibold">Placement Offers</div>
            <div className="mt-1 text-2xl font-bold font-mono text-purple-600">
              {adminStudents.filter(s => s.placedCompany).length} Offers
            </div>
            <div className="text-[11px] text-purple-700 mt-0.5">Campus Hiring 2026</div>
          </div>
        </div>
      </div>

      {/* Full Audit Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-sm">
            Student Clearance &amp; Placement Master Ledger
          </h2>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center cursor-pointer transition"
          >
            <Printer className="w-3.5 h-3.5 mr-1" /> Export Audit Report
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Roll No</th>
                <th className="px-5 py-3">Student Name</th>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Campus Placement</th>
                <th className="px-5 py-3">Cleared</th>
                <th className="px-5 py-3">Outstanding Dues</th>
                <th className="px-5 py-3">Consolidated Status</th>
                <th className="px-5 py-3">Placement NOC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {adminStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-3.5 font-mono font-bold text-slate-900">{s.rollNo}</td>
                  <td className="px-5 py-3.5 font-medium text-slate-900">{s.name}</td>
                  <td className="px-5 py-3.5 text-slate-600">{s.department}</td>
                  <td className="px-5 py-3.5 font-semibold text-emerald-700">{s.placedCompany || 'Seeking'}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-slate-700">{s.clearedCount}/6</span>
                  </td>
                  <td className="px-5 py-3.5 font-mono font-semibold">
                    {s.dueTotal > 0 ? (
                      <span className="text-rose-600">₹{s.dueTotal}</span>
                    ) : (
                      <span className="text-emerald-700">₹0</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      s.overallStatus === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {s.overallStatus.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {s.overallStatus === 'approved' ? (
                      <span className="text-emerald-700 font-semibold flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Eligible
                      </span>
                    ) : (
                      <span className="text-slate-400">On Hold</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
