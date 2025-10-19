'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { API_ENDPOINTS } from '../../../config/api';

export const dynamic = 'force-dynamic';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      if (!searchParams) return;
      
      // Get the authorization code from URL params
      const code = searchParams.get('code');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        // User denied access or other OAuth error
        console.error('OAuth error:', errorParam);
        router.push('/?error=access_denied');
        return;
      }

      if (!code) {
        console.error('No authorization code received');
        router.push('/?error=no_code');
        return;
      }

      try {
        // Exchange the authorization code for a token
        const response = await fetch(API_ENDPOINTS.OAUTH_EXCHANGE, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Important for cookies
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Authentication failed');
        }

        const data = await response.json();

        // Store the token if provided
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
        }

        // Verify the user has valid access
        const profileResponse = await fetch(API_ENDPOINTS.USER_PROFILE, {
          headers: {
            'Authorization': `Bearer ${data.token || ''}`,
          },
          credentials: 'include',
        });

        if (!profileResponse.ok) {
          throw new Error('Invalid account. Please use an authorized account.');
        }

        // Success! Redirect to dashboard
        router.push('/?authenticated=true');
      } catch (err) {
        console.error('Authentication error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
        router.push(`/?error=${encodeURIComponent(errorMessage)}`);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-2 pb-2">
          <div className="inline-flex items-center gap-2 justify-center">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-semibold text-primary">iReadCustomer</span>
          </div>
          <CardTitle className="text-center text-xl">
            {error ? 'Authentication Failed' : 'Verifying your account…'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          ) : (
            <div className="flex items-center justify-center py-6">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardHeader className="space-y-2 pb-2">
            <div className="inline-flex items-center gap-2 justify-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-semibold text-primary">iReadCustomer</span>
            </div>
            <CardTitle className="text-center text-xl">Loading…</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-6">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}

