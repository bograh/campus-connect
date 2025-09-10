"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function AuthExample() {
  const {
    user,
    loading,
    error,
    isAuthenticated,
    signIn,
    signUp,
    logout,
    clearError,
  } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    studentId: "",
    phoneNumber: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isSignUp) {
        await signUp(formData);
      } else {
        await signIn({
          email: formData.email,
          password: formData.password,
        });
      }
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated && user) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome back!</CardTitle>
          <CardDescription>You are successfully logged in</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Name</Label>
            <p>
              {user.firstName} {user.lastName}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium">Email</Label>
            <p>{user.email}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Student ID</Label>
            <p>{user.studentId}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Verification Status</Label>
            <p
              className={`capitalize ${
                user.verificationStatus === "approved"
                  ? "text-green-600"
                  : user.verificationStatus === "rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {user.verificationStatus}
            </p>
          </div>
          <Button onClick={logout} className="w-full">
            Logout
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{isSignUp ? "Sign Up" : "Sign In"}</CardTitle>
        <CardDescription>
          {isSignUp
            ? "Create your KNUST student account"
            : "Welcome back to CampusConnect"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-4" variant="destructive">
            <AlertDescription>{error}</AlertDescription>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={clearError}
            >
              ×
            </Button>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your.name@st.knust.edu.gh"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            {isSignUp && (
              <p className="text-sm text-muted-foreground mt-1">
                Only @st.knust.edu.gh emails are accepted
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          {isSignUp && (
            <>
              <div>
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  name="studentId"
                  type="text"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="+233123456789"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Button
            variant="link"
            onClick={() => {
              setIsSignUp(!isSignUp);
              clearError();
            }}
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
