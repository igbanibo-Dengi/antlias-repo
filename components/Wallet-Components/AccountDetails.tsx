"use client";
import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";

interface AccountDetailsProps {
  accountName: string;
  accountNumber: string;
  bankName: string;
}

const AccountDetails: React.FC<AccountDetailsProps> = ({
  accountName,
  accountNumber,
  bankName,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000); // Reset after 2 seconds
      })
      .catch((err) => console.error("Failed to copy:", err));
  };

  return (
    <div className="w-full space-y-4 rounded-lg border bg-white p-5 shadow-sm md:w-1/4 lg:w-[400px]">
      {/* Account Name */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Account Name
          </p>
          <p className="text-xs font-semibold">{accountName}</p>
        </div>
        <button
          onClick={() => handleCopy(accountName, "name")}
          className="text-muted-foreground hover:text-gray-700"
        >
          {copiedField === "name" ? (
            <Check size={20} className="text-green-500" />
          ) : (
            <Copy size={20} />
          )}
        </button>
      </div>

      {/* Account Number */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Account Number
          </p>
          <p className="text-xs font-semibold">{accountNumber}</p>
        </div>
        <button
          onClick={() => handleCopy(accountNumber, "number")}
          className="text-muted-foreground hover:text-gray-700"
        >
          {copiedField === "number" ? (
            <Check size={20} className="text-green-500" />
          ) : (
            <Copy size={20} />
          )}
        </button>
      </div>

      {/* Bank Name */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Bank Name</p>
          <p className="text-xs font-semibold">{bankName}</p>
        </div>
        <button
          onClick={() => handleCopy(bankName, "bank")}
          className="text-muted-foreground hover:text-gray-700"
        >
          {copiedField === "bank" ? (
            <Check size={20} className="text-green-500" />
          ) : (
            <Copy size={20} />
          )}
        </button>
      </div>
    </div>
  );
};

export default AccountDetails;
