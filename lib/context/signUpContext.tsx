"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";

// Define more specific types for each step of the signup process
type AuthData = {
  email: string;
  password: string;
  confirmPassword: string;
};

type CompanyData = {
  companyName: string;
  location: string;
  contactPhone: string;
  franchiseLicenseNo: string;
  numberOfStations: number;
};

type StationData = {
  branchName: string;
  branchLocation: string;
  branchPhone: string;
  cityName: string;
  stateName: string;
};

// Combined form data type
type FormData = AuthData & CompanyData & StationData;

// Default empty values
const defaultFormData: FormData = {
  email: "",
  password: "",
  confirmPassword: "",
  companyName: "",
  contactPhone: "",
  location: "",
  franchiseLicenseNo: "",
  numberOfStations: 0,
  branchName: "",
  branchLocation: "",
  branchPhone: "",
  cityName: "",
  stateName: "",
};

type SignupContextType = {
  data: FormData;
  updateData: (fields: Partial<FormData>) => void;
  clearData: () => void;
  // Add helper functions for specific steps
  isAuthComplete: () => boolean;
  isCompanyComplete: () => boolean;
};

const SignupContext = createContext<SignupContextType | undefined>(undefined);

const STORAGE_KEY = "antlias-signup-data";

export const SignupProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<FormData>(defaultFormData);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (typeof parsed === "object" && parsed !== null) {
          setData((prev) => ({ ...prev, ...parsed }));
        }
      } catch (err) {
        console.error("Error parsing signup data from localStorage:", err);
      }
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateData = (fields: Partial<FormData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const clearData = () => setData(defaultFormData);

  // Helper functions to check completion status of different steps
  const isAuthComplete = () => Boolean(data.email && data.password && data.confirmPassword);

  const isCompanyComplete = () =>
    Boolean(
      data.companyName &&
      data.contactPhone &&
      data.location &&
      data.franchiseLicenseNo &&
      data.numberOfStations > 0,
    );

  return (
    <SignupContext.Provider
      value={{
        data,
        updateData,
        clearData,
        isAuthComplete,
        isCompanyComplete,
      }}
    >
      {children}
    </SignupContext.Provider>
  );
};

export const useSignup = () => {
  const context = useContext(SignupContext);
  if (!context) throw new Error("useSignup must be used within SignupProvider");
  return context;
};
