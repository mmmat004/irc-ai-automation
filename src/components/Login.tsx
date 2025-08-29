import { useState } from "react";
import { Mail, Lock, Zap, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { toast } from "sonner@2.0.3";

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      toast("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (
        credentials.email === "admin@adminverify.com" &&
        credentials.password === "password"
      ) {
        toast("Login successful!");
        onLogin();
      } else {
        toast("Invalid email or password");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleDemoLogin = () => {
    setCredentials({
      email: "admin@adminverify.com",
      password: "password",
    });
    toast("Demo credentials filled in");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            
            <span className="text-3xl font-bold text-gray-900">
              AdminVerify
            </span>
          </div>
          <p className="text-gray-600">
            Sign in to your dashboard
          </p>
        </div>

        {/* Login Card */}
        <Card className="border border-gray-200 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Welcome Back
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    value={credentials.email}
                    onChange={(e) =>
                      setCredentials((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="Enter your email"
                    className="pl-10 border-gray-300"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    placeholder="Enter your password"
                    className="pl-10 pr-10 border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              {/* Demo Login */}
              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDemoLogin}
                  className="text-sm border-gray-300 hover:bg-gray-50"
                >
                  Use Demo Credentials
                </Button>
              </div>
            </form>

            {/* Demo Info */}
            <div className="mt-6 p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-800">
                <strong>Demo Login:</strong>
              </p>
              <p className="text-sm text-orange-700 mt-1">
                Email: admin@adminverify.com
                <br />
                Password: password
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          © 2025 AdminVerify. All rights reserved.
        </div>
      </div>
    </div>
  );
}