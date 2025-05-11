import NewStationForm from '@/components/forms/NewStationForm'
import { getAllEmployees } from '@/lib/actions/employee/employee';
import { getAllTenantBranches } from '@/lib/actions/tenant/tenant.action';
import { AlertTriangle } from 'lucide-react';
import React from 'react'

const page = async () => {

  const getBranches = await getAllTenantBranches();
  const getEmployees = await getAllEmployees();



  if (!getBranches.success || !getEmployees.success) {
    console.error('Error fetching branches or employees:', getBranches.error || getEmployees.error);

    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] h-full gap-4 p-6 bg-white rounded-lg shadow">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-10 w-10 text-red-500" />
          <h3 className="text-xl font-semibold text-gray-800">
            {getBranches.error ? 'Failed to Load Branches' : 'Failed to Load Employees'}
          </h3>
        </div>

        <p className="text-gray-600 text-center max-w-md">
          {'An unexpected error occurred while loading branch data.'}
        </p>
      </div>
    );
  }

  const branches = getBranches.data;
  const employees = getEmployees.data;

  return (
    <>
      {branches === undefined || employees === undefined ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] h-full gap-4 p-6 bg-white rounded-lg shadow">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-10 w-10 text-red-500" />
            <h3 className="text-xl font-semibold text-gray-800">Failed to Load Branches or employees</h3>
          </div>

          <p className="text-gray-600 text-center max-w-md">
            {'An unexpected error occurred while loading branch data or employee data.'}
          </p>
        </div>
      ) : (
        <NewStationForm branches={branches} employees={employees} />
      )}
    </>
  )
}

export default page