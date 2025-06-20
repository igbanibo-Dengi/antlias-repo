export type ActionResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
};

export interface Branch {
  id: string;
  tenantId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  managerId: string | null;
  contactPhone: string | null;
  isHeadQuarters: boolean | null;
  isActive: boolean | null;
  createdAt: Date | null;
}

export type EditBranchFormValues = {
  branchName: string
  address?: string
  contactPhone?: string | null
  city?: string
  state?: string
  isHQ: boolean | null;
  active: boolean | null;
}

export interface BranchProps {
  branches: Branch[];
}

export interface DbUser {
  id: string;
  tenantId: string;
  role: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  lastActivityDate: string | null;
  isActive: boolean | null;
  createdAt: Date | null;
}

export interface Employee {
  id: string;
  address: string | null;
  salary: number | null;
  createdAt: Date | null;
  tenantId: string;
  isActive: boolean | null;
  userId: string;
  branchId: string;
  firstName: string;
  lastName: string;
  contactNumber: string | null;
  email: string | null;
  hireDate: string | null;
  position: string | null;
  commission: string | null;
  bankName: string | null;
  accountNumber: string | null;
  accountName: string | null;
  bvn: string | null;
  guarantorName: string | null;
  guarantorPhone: string | null;
  guarantorAddress: string | null;
  guarantorRelationship: string | null;
}

export interface SellingPrices {
  id: string;
  tenantId: string;
  branchId: string;
  fuelType: string;
  price: string;
  createdAt: Date | null;
}
