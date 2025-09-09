"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Camera, Mail, Phone, MapPin, Calendar, CheckCircle, Upload } from "lucide-react"

export function ProfileManagement() {
  const [isEditing, setIsEditing] = useState(false)
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@university.edu",
    phone: "+1 (555) 123-4567",
    studentId: "STU123456",
    year: "Junior",
    major: "Computer Science",
    dorm: "North Hall, Room 204",
    bio: "Reliable student who enjoys helping others with deliveries around campus. Available most afternoons and weekends.",
    avatar: "/diverse-student-profiles.png",
    isVerified: true,
    verificationDate: "2024-01-15",
    rating: 4.8,
    completedDeliveries: 47,
    joinDate: "2023-09-01",
  })

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically save to your backend
    console.log("Saving profile changes:", user)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile Management</h1>
          <p className="text-muted-foreground">Manage your account information and verification status</p>
        </div>
        <Button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          variant={isEditing ? "default" : "outline"}
        >
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Overview */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="relative mx-auto">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="text-2xl">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button size="sm" variant="secondary" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="space-y-2">
              <CardTitle className="flex items-center justify-center gap-2">
                {user.name}
                {user.isVerified && <Shield className="h-4 w-4 text-primary" />}
              </CardTitle>
              <CardDescription>{user.studentId}</CardDescription>
              <div className="flex justify-center">
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Verified Student
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{user.rating}</div>
                <div className="text-xs text-muted-foreground">Rating</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{user.completedDeliveries}</div>
                <div className="text-xs text-muted-foreground">Deliveries</div>
              </div>
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Joined {new Date(user.joinDate).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-4 w-4" />
                Verified {new Date(user.verificationDate).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic account information and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="email" value={user.email} className="pl-10" disabled />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={user.phone}
                      onChange={(e) => setUser({ ...user, phone: e.target.value })}
                      className="pl-10"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input id="studentId" value={user.studentId} disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
              <CardDescription>Your academic details and campus location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="year">Academic Year</Label>
                  <Select
                    value={user.year}
                    onValueChange={(value) => setUser({ ...user, year: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Freshman">Freshman</SelectItem>
                      <SelectItem value="Sophomore">Sophomore</SelectItem>
                      <SelectItem value="Junior">Junior</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                      <SelectItem value="Graduate">Graduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="major">Major</Label>
                  <Input
                    id="major"
                    value={user.major}
                    onChange={(e) => setUser({ ...user, major: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="dorm">Campus Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="dorm"
                      value={user.dorm}
                      onChange={(e) => setUser({ ...user, dorm: e.target.value })}
                      className="pl-10"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
              <CardDescription>Tell other students about yourself and your delivery preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={user.bio}
                  onChange={(e) => setUser({ ...user, bio: e.target.value })}
                  disabled={!isEditing}
                  rows={4}
                  placeholder="Tell other students about yourself..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Verification Status */}
          <Card>
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
              <CardDescription>Your account verification and security information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Your account is fully verified. You can participate in all CampusConnect activities.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="font-medium">Email Verified</div>
                      <div className="text-sm text-muted-foreground">
                        Verified on {new Date(user.verificationDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="font-medium">Student ID Verified</div>
                      <div className="text-sm text-muted-foreground">Documents approved by admin</div>
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  <Upload className="mr-2 h-4 w-4" />
                  Update Verification Documents
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
