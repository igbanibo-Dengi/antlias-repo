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
      <div className="bg-white rounded-lg space-x- shadow-sm p-4 mb-6 flex items-center justify-between">
        <div className="text-lg font-medium">Setting</div>
        <div className="flex items-center flex-1 gap-60 mx-4">
          <div className="relative flex items-center flex-1 max-w-md ">
            <Search className="absolute left-3 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10 border-gray-200 text-sm"
              placeholder="Type here..."
            />
          </div>
        </div>
      </div>

      {/* Header Tabs */}
      <div className="w-full">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="bg-transparent border-b justify-start rounded-none h-auto gap-6">
            <TabsTrigger
              value="general"
              className="py-4 px-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:bg-muted data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none bg-transparent"
            >
              General
            </TabsTrigger>
            <TabsTrigger
              value="pos"
              className="py-4 px-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:bg-muted data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none bg-transparent"
            >
              POS
            </TabsTrigger>
            <TabsTrigger
              value="user-management"
              className="py-4 px-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:bg-muted data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none bg-transparent"
            >
              User Management
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="py-4 px-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:bg-muted data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none bg-transparent"
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
