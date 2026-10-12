export type UserRole = 'student' | 'department_officer' | 'admin';

export type DepartmentCode = 
  | 'academic'
  | 'library'
  | 'accounts'
  | 'hostel'
  | 'sports'
  | 'placement';

export type ClearanceStatus = 'pending' | 'in_review' | 'approved' | 'rejected';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  studentId?: string; // Roll number
  department?: string; // e.g. "Computer Science & Engineering"
  departmentManaged?: DepartmentCode; // If department officer
  phone?: string;
  cgpa?: number;
  placementStatus?: 'Seeking' | 'Placed' | 'Opted Out';
  placedCompany?: string;
  placedPackage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentClearance {
  departmentCode: DepartmentCode;
  departmentName: string;
  status: ClearanceStatus;
  dueAmount: number; // 0 if no dues
  remarks?: string;
  clearedAt?: string;
  clearedBy?: string;
  requiredDocuments?: string[];
  proofSubmitted?: string;
}

export interface ClearanceRequest {
  id: string;
  studentUid: string;
  studentName: string;
  studentEmail: string;
  studentId: string;
  studentDepartment: string;
  academicYear: string;
  degree: string;
  submissionDate: string;
  overallStatus: ClearanceStatus;
  departments: Record<DepartmentCode, DepartmentClearance>;
  placementNocEligible: boolean;
  certificateNumber?: string;
  certificateIssuedAt?: string;
  updatedAt: string;
}

export interface DepartmentSummary {
  code: DepartmentCode;
  name: string;
  icon: string;
  description: string;
  contactPerson: string;
  location: string;
}

export interface PlacementDrive {
  id: string;
  companyName: string;
  category: 'Tier-1 Product' | 'Core Engineering' | 'Consulting & FinTech' | 'Mass IT Services';
  role: string;
  ctc: string;
  location: string;
  eligibleBranches: string[];
  minCgpa: number;
  deadline: string;
  driveDate: string;
  status: 'open' | 'shortlisting' | 'completed' | 'upcoming';
  type: 'Full-Time FTE' | 'Internship + PPO' | 'Summer Internship';
  openings: number;
  description: string;
  hiringRounds: string[];
}

export interface PlacementApplication {
  id: string;
  driveId: string;
  companyName: string;
  role: string;
  ctc: string;
  appliedDate: string;
  status: 'Applied' | 'Online Assessment' | 'Technical Interview' | 'HR Round' | 'Selected' | 'Not Shortlisted';
  offerLetterSubmitted?: boolean;
}
