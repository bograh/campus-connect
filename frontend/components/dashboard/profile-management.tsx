"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  Upload,
} from "lucide-react";

export function ProfileManagement() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const { user, updateProfile, uploadVerificationDocument, loading } =
    useAuth();
  const [docType, setDocType] = useState<"student_id" | "selfie" | "other">(
    "student_id"
  );
  const [docFile, setDocFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    gender: user?.gender || "",
    indexNumber: user?.indexNumber || "",
    programmeOfStudy: user?.programmeOfStudy || "",
    currentYear: user?.currentYear || 1,
  });

  if (user && !isEditing) {
    if (
      formData.firstName !== user.firstName ||
      formData.lastName !== user.lastName
    ) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender || "",
        indexNumber: user.indexNumber || "",
        programmeOfStudy: user.programmeOfStudy || "",
        currentYear: user.currentYear || 1,
      });
    }
  }

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    setError("");

    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      setError("Failed to update profile. Please try again.");
      console.error("Profile update error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender || "",
        indexNumber: user.indexNumber || "",
        programmeOfStudy: user.programmeOfStudy || "",
        currentYear: user.currentYear || 1,
      });
    }
    setIsEditing(false);
    setError("");
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Profile Management
          </h1>
          <p className="text-muted-foreground">
            Manage your account information and verification status
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                onClick={handleCancel}
                variant="outline"
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="relative mx-auto">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={user.profileImage || "/placeholder.svg"}
                  alt={`${user.firstName} ${user.lastName}`}
                />
                <AvatarFallback className="text-2xl">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="space-y-2">
              <CardTitle className="flex items-center justify-center gap-2">
                {user.firstName} {user.lastName}
                {user.verificationStatus === "approved" && (
                  <Shield className="h-4 w-4 text-primary" />
                )}
              </CardTitle>
              <CardDescription>{user.studentId}</CardDescription>
              <div className="flex justify-center">
                <Badge
                  variant={
                    user.verificationStatus === "approved"
                      ? "secondary"
                      : "outline"
                  }
                  className="gap-1"
                >
                  {user.verificationStatus === "approved" ? (
                    <>
                      <CheckCircle className="h-3 w-3" />
                      Verified Student
                    </>
                  ) : (
                    <>Verification {user.verificationStatus}</>
                  )}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {user.rating.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Rating</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {user.totalDeliveries}
                </div>
                <div className="text-xs text-muted-foreground">Deliveries</div>
              </div>
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </div>
              {user.verificationStatus === "approved" && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  Account verified
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Your basic account information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      value={user.email}
                      className="pl-10"
                      disabled
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={user.phoneNumber}
                      className="pl-10"
                      disabled
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input id="studentId" value={user.studentId} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData({ ...formData, gender: value })
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Prefer not to say">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
              <CardDescription>
                Your academic details and student information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currentYear">Current Year</Label>
                  <Select
                    value={formData.currentYear.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, currentYear: parseInt(value) })
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Year 1</SelectItem>
                      <SelectItem value="2">Year 2</SelectItem>
                      <SelectItem value="3">Year 3</SelectItem>
                      <SelectItem value="4">Year 4</SelectItem>
                      <SelectItem value="5">Year 5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="programme">Programme of Study</Label>
                  <Input
                    id="programme"
                    value={formData.programmeOfStudy}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        programmeOfStudy: e.target.value,
                      })
                    }
                    placeholder="e.g., Computer Science"
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="indexNumber">Index Number</Label>
                  <Input
                    id="indexNumber"
                    value={formData.indexNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, indexNumber: e.target.value })
                    }
                    placeholder="Your university index number"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
              <CardDescription>
                Your account verification and security information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert
                variant={
                  user.verificationStatus === "approved"
                    ? "default"
                    : "destructive"
                }
              >
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  {user.verificationStatus === "approved"
                    ? "Your account is fully verified. You can participate in all CampusConnect activities."
                    : user.verificationStatus === "pending"
                    ? "Your account verification is pending. Please wait for admin approval."
                    : "Your account verification was rejected. Please contact support."}
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail
                      className={`h-4 w-4 ${
                        user.verificationStatus === "approved"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    />
                    <div>
                      <div className="font-medium">Email Address</div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  {user.verificationStatus === "approved" ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <div className="h-5 w-5 rounded-full bg-yellow-100 border border-yellow-300" />
                  )}
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield
                      className={`h-4 w-4 ${
                        user.verificationStatus === "approved"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    />
                    <div>
                      <div className="font-medium">Student Verification</div>
                      <div className="text-sm text-muted-foreground capitalize">
                        Status: {user.verificationStatus}
                      </div>
                    </div>
                  </div>
                  {user.verificationStatus === "approved" ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <div className="h-5 w-5 rounded-full bg-yellow-100 border border-yellow-300" />
                  )}
                </div>

                <div className="space-y-2 p-3 border rounded-lg">
                  <div className="font-medium flex items-center gap-2">
                    <Upload className="h-4 w-4" /> Upload verification document
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="space-y-1">
                      <Label htmlFor="docType">Document Type</Label>
                      <Select
                        value={docType}
                        onValueChange={(v) => setDocType(v as any)}
                      >
                        <SelectTrigger id="docType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student_id">Student ID</SelectItem>
                          <SelectItem value="selfie">Selfie</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <Label htmlFor="docFile">File</Label>
                      <Input
                        id="docFile"
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) =>
                          setDocFile(e.target.files?.[0] || null)
                        }
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={async () => {
                        if (!docFile) return;
                        setIsUploading(true);
                        setError("");
                        try {
                          await uploadVerificationDocument(docType, docFile);
                        } catch (err) {
                          setError(
                            "Failed to upload document. Please try again."
                          );
                        } finally {
                          setIsUploading(false);
                          setDocFile(null);
                        }
                      }}
                      disabled={isUploading || !docFile}
                    >
                      {isUploading ? "Uploading..." : "Upload Document"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
