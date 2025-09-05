import { useState, useEffect } from "react";
import { User, Mail, Shield, LogOut, Crown } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import { API_ENDPOINTS } from "../config/api";

interface GoogleProfile {
  id: string;
  name: string;
  email: string;
  picture: string;
  given_name: string;
  family_name: string;
  email_verified: boolean;
  role: string;
}

export function Profile() {
  const [profileData, setProfileData] = useState<GoogleProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.USER_PROFILE, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies for authentication
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Profile data from backend:', data);
          setProfileData(data);
        } else {
          console.error('Failed to fetch profile:', response.status);
          // If unauthorized, don't reload - just show error
          if (response.status === 401) {
            console.log('User not authenticated yet');
          }
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('auth_token');
    toast("Signed out successfully");
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
          <h1>Profile</h1>
          <p className="text-muted-foreground mt-2">Your Google account information</p>
        </div>

        <div className="max-w-2xl space-y-8">
          {/* Profile Information */}
          <Card>
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
                  <h3>{profileData.name}</h3>
                  <p className="text-muted-foreground">{profileData.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Crown className="w-4 h-4 text-primary" />
                    <Badge variant="secondary">{profileData.role}</Badge>
                    {profileData.email_verified && (
                      <Badge variant="secondary">
                        <Shield className="w-3 h-3 mr-1" />
                        Email Verified
                      </Badge>
                    )}
                  </div>
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
                  <span className="text-muted-foreground">Role</span>
                  <span className="font-medium">{profileData.role}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
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
            </CardContent>
          </Card>

          {/* Sign Out */}
          <Card>
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
              <Button onClick={handleSignOut} variant="outline">
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