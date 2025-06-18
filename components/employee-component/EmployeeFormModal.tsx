import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface EmployeeFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const [formData, setFormData] = useState({
    employeeId: "",
    BVN: "",
    name: "",
    contactNumber: "",
    address: "",
    role: "Please Select",
    salary: "",
    commission: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    guarantorName: "",
    guarantorContact: "",
    guarantorAddress: "",
    relationship: "Please Select",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="h-[100vh] overflow-y-auto rounded-lg bg-white p-6 shadow-lg sm:max-w-[700px] lg:max-h-[99vh] lg:max-w-[900px]">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">
          Add New Employee
        </h2>
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Personal Information */}
            <div className="border border-gray-300 p-3">
              <h3 className="mb-2 text-4xl font-bold text-gray-700">
                Personal Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="7868"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Name (First Name / Last Name)
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option>Please Select</option>
                    <option>Manager</option>
                    <option>Developer</option>
                    <option>Support</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Salary
                  </label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Commission
                  </label>
                  <input
                    type="number"
                    name="commission"
                    value={formData.commission}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Salary Details */}
            <div className="h-[240px] border border-gray-300 p-3">
              <h3 className="mb-2 text-4xl font-bold text-gray-700">
                Salary Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Account Name
                  </label>
                  <input
                    type="text"
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    BVN
                  </label>
                  <input
                    type="text"
                    name="BVN"
                    value={formData.BVN}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Guarantor */}
            <div className="h-[257px] border border-gray-300 p-3">
              <h3 className="mb-2 text-4xl font-bold text-gray-700">
                Guarantor
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Name (First Name / Last Name)
                  </label>
                  <input
                    type="text"
                    name="guarantorName"
                    value={formData.guarantorName}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    name="guarantorContact"
                    value={formData.guarantorContact}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    name="guarantorAddress"
                    value={formData.guarantorAddress}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Relationship
                  </label>
                  <select
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option>Please Select</option>
                    <option>Family</option>
                    <option>Friend</option>
                    <option>Other</option>
                  </select>
                </div>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Add New Guarantor Field
                </button>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="right-19 fixed h-[35.65px] w-[250.64px] rounded-md bg-[#3A57E8] p-5 text-xl font-bold text-white transition-colors hover:opacity-90"
          >
            Submit
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeFormModal;
