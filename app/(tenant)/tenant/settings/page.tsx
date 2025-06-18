import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import General from "@/components/general";
import Security from "@/components/security";
import UserManagement from "@/components/usermanagement";
import { Search } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="w-full">
      {/* Stations Header */}
      <div className="space-x- mb-6 flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
        <div className="text-lg font-medium">Setting</div>
        <div className="mx-4 flex flex-1 items-center gap-60">
          <div className="relative flex max-w-md flex-1 items-center">
            <Search className="absolute left-3 h-4 w-4 text-gray-400" />
            <Input
              className="border-gray-200 pl-10 text-sm"
              placeholder="Type here..."
            />
          </div>
        </div>
      </div>

      {/* Header Tabs */}
      <div className="w-full">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="h-auto justify-start gap-6 rounded-none border-b bg-transparent">
            <TabsTrigger
              value="general"
              className="rounded-none bg-transparent px-1 py-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-muted data-[state=active]:text-primary data-[state=active]:shadow-none"
            >
              General
            </TabsTrigger>
            <TabsTrigger
              value="pos"
              className="rounded-none bg-transparent px-1 py-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-muted data-[state=active]:text-primary data-[state=active]:shadow-none"
            >
              POS
            </TabsTrigger>
            <TabsTrigger
              value="user-management"
              className="rounded-none bg-transparent px-1 py-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-muted data-[state=active]:text-primary data-[state=active]:shadow-none"
            >
              User Management
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="rounded-none bg-transparent px-1 py-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-muted data-[state=active]:text-primary data-[state=active]:shadow-none"
            >
              Security
            </TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="mt-6">
            <Card>
              <General />
            </Card>
          </TabsContent>
          <TabsContent value="user-management" className="mt-6">
            <Card>
              <UserManagement />
            </Card>
          </TabsContent>
          <TabsContent value="security" className="mt-6">
            <Card>
              <Security />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
