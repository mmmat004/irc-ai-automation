import { useState } from "react";
import { User, Mail, Lock, Save } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { toast } from "sonner@2.0.3";

export function Profile() {
  const [profileData, setProfileData] = useState({
    name: "John Smith",
    email: "john.smith@adminverify.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast("Profile updated successfully!");
      setIsLoading(false);
    }, 1000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (profileData.newPassword !== profileData.confirmPassword) {
      toast("New passwords don't match!");
      return;
    }

    if (profileData.newPassword.length < 8) {
      toast("Password must be at least 8 characters long!");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast("Password changed successfully!");
      setProfileData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="h-full overflow-auto bg-background">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account information and security settings.</p>
        </div>

        <div className="max-w-2xl space-y-8">
          {/* Profile Information */}
          <Card className="border border-border shadow-sm rounded-xl hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className="border-border rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className="border-border rounded-lg"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 rounded-lg"
                >
                  <Save className="w-4 h-4" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card className="border border-border shadow-sm rounded-xl hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={profileData.currentPassword}
                    onChange={(e) => setProfileData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="border-border rounded-lg"
                    placeholder="Enter your current password"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={profileData.newPassword}
                    onChange={(e) => setProfileData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="border-border rounded-lg"
                    placeholder="Enter new password (min. 8 characters)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={profileData.confirmPassword}
                    onChange={(e) => setProfileData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="border-border rounded-lg"
                    placeholder="Confirm your new password"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !profileData.currentPassword || !profileData.newPassword || !profileData.confirmPassword}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 rounded-lg"
                >
                  <Lock className="w-4 h-4" />
                  {isLoading ? "Changing..." : "Change Password"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card className="border border-border shadow-sm rounded-xl hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Account Type</span>
                <span className="font-medium">Administrator</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Member Since</span>
                <span className="font-medium">January 2024</span>
              </div>
              <Separator />
      
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}