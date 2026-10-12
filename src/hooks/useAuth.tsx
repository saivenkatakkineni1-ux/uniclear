import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase/config';
import { UserProfile, ClearanceRequest, DepartmentCode, ClearanceStatus } from '../types';

interface SignUpData {
  fullName: string;
  email: string;
  studentId: string;
  department: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<UserProfile>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
  // Demo switch for evaluating officer/admin views without violating production security
  activeRoleOverride: string | null;
  setActiveRoleOverride: (role: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Human-friendly error translation for Firebase Auth error codes
export function formatAuthError(error: any): string {
  if (!error) return 'An unexpected error occurred.';
  const code = error.code || '';
  
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This college email is already registered. Please sign in instead.';
    case 'auth/invalid-email':
      return 'The email address format is invalid. Please use your valid university email.';
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not enabled in this Firebase project. To fix this: Open your Firebase Console -> go to Authentication -> Sign-in method -> click Email/Password -> switch Enable to ON and Save.';
    case 'auth/weak-password':
      return 'Password is too weak. Please choose a password with at least 8 characters including letters and numbers.';
    case 'auth/user-disabled':
      return 'This university account has been disabled. Contact the Registrar or IT Support.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid college email or password. Please double-check your credentials.';
    case 'auth/too-many-requests':
      return 'Access to this account has been temporarily disabled due to many failed login attempts. Please reset your password or try again later.';
    case 'auth/network-request-failed':
      return 'Network connection failed. Please check your internet connection.';
    default:
      return error.message || 'Authentication failed. Please verify your details and try again.';
  }
}

const DEFAULT_DEPARTMENTS: Record<DepartmentCode, { name: string; remarks: string; dueAmount: number; status: ClearanceStatus }> = {
  academic: {
    name: 'Academic Department (HOD)',
    remarks: 'Awaiting end-semester course credits and lab record verification',
    dueAmount: 0,
    status: 'pending'
  },
  library: {
    name: 'Central University Library',
    remarks: 'Pending verification of borrowed books and catalog return',
    dueAmount: 0,
    status: 'pending'
  },
  accounts: {
    name: 'Finance & Accounts Division',
    remarks: 'Tuition fees reconciled. Caution deposit balance verification pending.',
    dueAmount: 0,
    status: 'pending'
  },
  hostel: {
    name: 'Hostel & Residence Office',
    remarks: 'Room inventory handover and mess billing dues verification',
    dueAmount: 0,
    status: 'pending'
  },
  sports: {
    name: 'Sports & Physical Education Dept',
    remarks: 'Annual equipment check and gym access clearance',
    dueAmount: 0,
    status: 'approved' // Usually sports is clear unless fine
  },
  placement: {
    name: 'Training & Placement Cell (T&P)',
    remarks: 'Awaiting department clearance before issuing final Placement NOC',
    dueAmount: 0,
    status: 'pending'
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeRoleOverride, setActiveRoleOverride] = useState<string | null>(null);

  const fetchUserProfile = async (firebaseUser: User): Promise<UserProfile | null> => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as UserProfile;
        setUserProfile(data);
        return data;
      } else {
        // Fallback profile if Firestore record is missing
        const fallbackProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || 'University Student',
          role: 'student', // Never admin by default
          studentId: 'STU-' + firebaseUser.uid.substring(0, 6).toUpperCase(),
          department: 'General Engineering',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        try {
          await setDoc(userRef, fallbackProfile);
        } catch (e) {
          console.warn('Could not save fallback profile:', e);
        }
        setUserProfile(fallbackProfile);
        return fallbackProfile;
      }
    } catch (err) {
      console.error('Error fetching user profile from Firestore:', err);
      // Return a basic profile so the student can still access their dashboard
      const minimalProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || 'University Student',
        role: 'student',
        studentId: 'STU-' + firebaseUser.uid.substring(0, 6).toUpperCase(),
        department: 'Student Body',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUserProfile(minimalProfile);
      return minimalProfile;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserProfile(currentUser);
      } else {
        setUserProfile(null);
        setActiveRoleOverride(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string) => {
    setError(null);
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
      await fetchUserProfile(userCredential.user);
    } catch (err: any) {
      const readableError = formatAuthError(err);
      setError(readableError);
      throw new Error(readableError);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: SignUpData): Promise<UserProfile> => {
    setError(null);
    setLoading(true);
    try {
      // 1. Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, data.email.trim(), data.password);
      const newUser = userCredential.user;

      // 2. Update display name in Firebase Auth
      await updateProfile(newUser, {
        displayName: data.fullName.trim()
      });

      // 3. Store additional student profile in Cloud Firestore
      // Security enforcement: Role is strictly locked to 'student'
      const newProfile: UserProfile = {
        uid: newUser.uid,
        email: newUser.email || data.email.trim(),
        displayName: data.fullName.trim(),
        role: 'student', // Explicitly student, admin cannot be self-provisioned
        studentId: data.studentId.trim().toUpperCase(),
        department: data.department.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', newUser.uid), newProfile);
      setUserProfile(newProfile);

      // 4. Initialize initial student clearance record in Firestore
      try {
        const initialClearance: ClearanceRequest = {
          id: newUser.uid,
          studentUid: newUser.uid,
          studentName: data.fullName.trim(),
          studentEmail: data.email.trim(),
          studentId: data.studentId.trim().toUpperCase(),
          studentDepartment: data.department.trim(),
          academicYear: '2025-2026',
          degree: 'Bachelor of Technology (B.Tech)',
          submissionDate: new Date().toISOString().split('T')[0],
          overallStatus: 'pending',
          departments: {
            academic: {
              departmentCode: 'academic',
              departmentName: DEFAULT_DEPARTMENTS.academic.name,
              status: DEFAULT_DEPARTMENTS.academic.status,
              dueAmount: DEFAULT_DEPARTMENTS.academic.dueAmount,
              remarks: DEFAULT_DEPARTMENTS.academic.remarks
            },
            library: {
              departmentCode: 'library',
              departmentName: DEFAULT_DEPARTMENTS.library.name,
              status: DEFAULT_DEPARTMENTS.library.status,
              dueAmount: DEFAULT_DEPARTMENTS.library.dueAmount,
              remarks: DEFAULT_DEPARTMENTS.library.remarks
            },
            accounts: {
              departmentCode: 'accounts',
              departmentName: DEFAULT_DEPARTMENTS.accounts.name,
              status: DEFAULT_DEPARTMENTS.accounts.status,
              dueAmount: DEFAULT_DEPARTMENTS.accounts.dueAmount,
              remarks: DEFAULT_DEPARTMENTS.accounts.remarks
            },
            hostel: {
              departmentCode: 'hostel',
              departmentName: DEFAULT_DEPARTMENTS.hostel.name,
              status: DEFAULT_DEPARTMENTS.hostel.status,
              dueAmount: DEFAULT_DEPARTMENTS.hostel.dueAmount,
              remarks: DEFAULT_DEPARTMENTS.hostel.remarks
            },
            sports: {
              departmentCode: 'sports',
              departmentName: DEFAULT_DEPARTMENTS.sports.name,
              status: DEFAULT_DEPARTMENTS.sports.status,
              dueAmount: DEFAULT_DEPARTMENTS.sports.dueAmount,
              remarks: DEFAULT_DEPARTMENTS.sports.remarks
            },
            placement: {
              departmentCode: 'placement',
              departmentName: DEFAULT_DEPARTMENTS.placement.name,
              status: DEFAULT_DEPARTMENTS.placement.status,
              dueAmount: DEFAULT_DEPARTMENTS.placement.dueAmount,
              remarks: DEFAULT_DEPARTMENTS.placement.remarks
            }
          },
          placementNocEligible: false,
          updatedAt: new Date().toISOString()
        };

        await setDoc(doc(db, 'clearance_requests', newUser.uid), initialClearance);
      } catch (clearanceErr) {
        console.warn('Initial clearance request doc initialization notice:', clearanceErr);
      }

      return newProfile;
    } catch (err: any) {
      const readableError = formatAuthError(err);
      setError(readableError);
      throw new Error(readableError);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserProfile(null);
      setActiveRoleOverride(null);
      setError(null);
    } catch (err: any) {
      const readableError = formatAuthError(err);
      setError(readableError);
    }
  };

  const resetPassword = async (email: string) => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err: any) {
      const readableError = formatAuthError(err);
      setError(readableError);
      throw new Error(readableError);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        resetPassword,
        clearError,
        activeRoleOverride,
        setActiveRoleOverride
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
