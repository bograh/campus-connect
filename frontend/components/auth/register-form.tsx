"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, User, Upload } from "lucide-react";
import { useAuth } from "@/lib/hooks";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const { signUp, loading, error, clearError, uploadVerificationDocument } =
    useAuth();
  const router = useRouter();

  const [studentIdFile, setStudentIdFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    clearError();

    if (!email.endsWith("@st.knust.edu.gh")) {
      console.warn("Only KNUST student emails (@st.knust.edu.gh) are allowed");
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    try {
      await signUp({
        firstName,
        lastName,
        email,
        password,
        studentId: email.split("@")[0],
        phoneNumber: "+233123456789",
        gender: "Male",
      });

      setStep(2);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  if (step === 2) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Verify Your Identity</h3>
          <p className="text-sm text-muted-foreground">
            Upload your student ID and a selfie for verification
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="studentId">Student ID Document</Label>
            <Input
              id="studentId"
              name="studentId"
              type="file"
              accept="image/*,.pdf"
              className="cursor-pointer"
              onChange={(e) => setStudentIdFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="selfie">Selfie Photo</Label>
            <Input
              id="selfie"
              name="selfie"
              type="file"
              accept="image/*"
              className="cursor-pointer"
              onChange={(e) => setSelfieFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              className="border-primary"
              onCheckedChange={(checked) => setTermsAccepted(!!checked)}
            />
            <Label htmlFor="terms" className="text-sm">
              I agree to the terms of service and privacy policy
            </Label>
          </div>
        </div>

        {verifyError && (
          <Alert variant="destructive">
            <AlertDescription>{verifyError}</AlertDescription>
          </Alert>
        )}

        <Button
          className="w-full"
          disabled={
            verifying || !termsAccepted || (!studentIdFile && !selfieFile)
          }
          onClick={async () => {
            if (!termsAccepted) {
              setVerifyError("Please accept the terms to continue");
              return;
            }
            if (!studentIdFile && !selfieFile) {
              setVerifyError("Please select at least one file to upload");
              return;
            }
            setVerifyError("");
            setVerifying(true);
            try {
              if (studentIdFile) {
                await uploadVerificationDocument("student_id", studentIdFile);
              }
              if (selfieFile) {
                await uploadVerificationDocument("selfie", selfieFile);
              }
              router.push("/dashboard");
            } catch (e) {
              setVerifyError(
                "Failed to submit verification. Please try again."
              );
            } finally {
              setVerifying(false);
            }
          }}
        >
          {verifying ? "Submitting..." : "Submit for Verification"}
        </Button>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Your documents will be reviewed within 24 hours
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Enter your full name"
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">KNUST Student Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your.name@st.knust.edu.gh"
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            className="pl-10 pr-10"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            className="pl-10"
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
}
