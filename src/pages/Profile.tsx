import { useState, useEffect } from "react";
import { User, Mail, Calendar, Shield, LogOut } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";

interface GoogleProfile {
  id: string;
  name: string;
  email: string;
  picture: string;
  given_name: string;
  family_name: string;
  email_verified: boolean;
  locale: string;
  hd?: string;
}

export function Profile() {
  const [profileData, setProfileData] = useState<GoogleProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    
    // Try to decode JWT token to get user info
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setProfileData({
        id: payload.sub || "",
        name: payload.name || payload.email || "User",
        email: payload.email || "",
        picture: payload.picture || "https://lh3.googleusercontent.com/a/default-user",
        given_name: payload.given_name || payload.name?.split(' ')[0] || "",
        family_name: payload.family_name || payload.name?.split(' ')[1] || "",
        email_verified: Boolean(payload.email_verified),
        locale: payload.locale || "en",
        hd: payload.hd,
      });
    } catch (error) {
      setProfileData(null);
    }
    setIsLoading(false);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('auth_token');
    toast("Signed out successfully");
    // Optionally force reload to return to login screen
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="h-full overflow-auto bg-background">
        <div className="p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="h-full overflow-auto bg-background">
        <div className="p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-muted-foreground">Failed to load profile data</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-background">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Google Account Profile</h1>
          <p className="text-muted-foreground mt-2">Your account information from Google.</p>
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
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profileData.picture} alt={profileData.name} />
                  <AvatarFallback>{profileData.given_name[0]}{profileData.family_name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{profileData.name}</h3>
                  <p className="text-muted-foreground">{profileData.email}</p>
                  {profileData.email_verified && (
                    <Badge variant="secondary" className="mt-1">
                      <Shield className="w-3 h-3 mr-1" />
                      Email Verified
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">First Name</span>
                  <span className="font-medium">{profileData.given_name}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Last Name</span>
                  <span className="font-medium">{profileData.family_name}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Email Address</span>
                  <span className="font-medium">{profileData.email}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Language</span>
                  <span className="font-medium">{profileData.locale}</span>
                </div>
                {profileData.hd && (
                  <>
                    <Separator />
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Domain</span>
                      <span className="font-medium">{profileData.hd}</span>
                    </div>
                  </>
                )}
              </div>
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
                <span className="font-medium">Google Account</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">User ID</span>
                <span className="font-medium font-mono text-sm">{profileData.id}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Connected Since</span>
                <span className="font-medium">January 2024</span>
              </div>
            </CardContent>
          </Card>

          {/* Sign Out */}
          <Card className="border border-border shadow-sm rounded-xl hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <LogOut className="w-5 h-5" />
                Sign Out
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Sign out of your Google account. You'll need to sign in again to access the application.
              </p>
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}