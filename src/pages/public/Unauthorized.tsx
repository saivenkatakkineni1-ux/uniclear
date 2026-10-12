import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface UnauthorizedProps {
  onReturnToHome: () => void;
}

export const Unauthorized: React.FC<UnauthorizedProps> = ({ onReturnToHome }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-600 mb-4 shadow-sm">
          <ShieldAlert className="w-9 h-9" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Access Restricted</h2>
        <p className="mt-2 text-sm text-slate-600">
          You do not have the required administrative or department officer credentials to access this area.
        </p>

        <div className="mt-6">
          <button
            type="button"
            onClick={onReturnToHome}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Student Portal
          </button>
        </div>
      </div>
    </div>
  );
};
