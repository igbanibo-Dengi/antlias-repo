import React from 'react'
import { NewEmployeeForm } from '../_components/NewEmployeeForm'
import { getAllTenantBranches, getTenantId } from '@/lib/actions/tenant/tenant.action'


const page = async () => {
  const result = await getAllTenantBranches();

  if (!Array.isArray(result)) {
    console.error(result.error); // Log the error
    return (
      <div>
        <p>Error: {result.error}</p>
      </div>
    );
  }

  return (
    <div>
      <NewEmployeeForm branches={result} />
    </div>
  );
};

export default page;