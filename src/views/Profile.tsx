import { useState, useEffect } from "react";
import { User, Mail, Shield, LogOut, Crown } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import { API_ENDPOINTS } from "../config/api";
import { useLanguage } from "../contexts/LanguageContext";

interface GoogleProfile {
  id: string;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  email_verified: boolean;
  role: string;
}

export function Profile() {
  const { t } = useLanguage();
  const [profileData, setProfileData] = useState<GoogleProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let response;
        try {
          response = await fetch(API_ENDPOINTS.USER_PROFILE, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });
        } catch (error) {
          response = await fetch(API_ENDPOINTS.USER_PROFILE, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }

        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
        } else if (response.status === 401) {
          console.warn('Profile fetch failed: 401 Unauthorized - Session expired or cookies not sent');
          toast.error(t('profile.failedToLoad'));
        } else {
          console.error('Profile fetch failed with status:', response.status);
          toast.error(t('profile.failedToLoad'));
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
        toast.error(t('newsDetail.serverError'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch(API_ENDPOINTS.LOGOUT, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
    } finally {
      localStorage.removeItem('auth_token');
      toast(t('common.success'));
      window.location.reload();
    }
  };

  if (isLoading) {
    return (
      <div className="h-full overflow-auto bg-background">
        <div className="p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">{t('profile.loading')}</p>
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
              <p className="text-muted-foreground">{t('profile.failedToLoad')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-background">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('profile.title')}</h1>
          <p className="text-muted-foreground mt-2">{t('profile.yourGoogleAccount')}</p>
        </div>

        <div className="max-w-2xl space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                {t('profile.information')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-16 w-16">
                  
                  <AvatarFallback>{profileData.firstName?.[0] || ''}{profileData.lastName?.[0] || ''}</AvatarFallback>
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
                        {t('profile.emailVerified')}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">{t('profile.firstName')}</span>
                  <span className="font-medium">{profileData.firstName}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">{t('profile.lastName')}</span>
                  <span className="font-medium">{profileData.lastName}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">{t('profile.emailAddress')}</span>
                  <span className="font-medium">{profileData.email}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">{t('profile.role')}</span>
                  <span className="font-medium">{profileData.role}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                {t('profile.accountDetails')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">{t('profile.accountType')}</span>
                <span className="font-medium">{t('profile.googleAccount')}</span>
              </div>
  
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <LogOut className="w-5 h-5" />
                {t('sidebar.signOut')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {t('profile.signOutDescription')}
              </p>
              <Button onClick={handleSignOut} variant="outline">
                <LogOut className="w-4 h-4 mr-2" />
                {t('sidebar.signOut')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


