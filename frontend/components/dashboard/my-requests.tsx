"use client"

import { useState, useMemo } from "react"
import { useAuth, useDeliveryRequests } from "@/lib/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, MapPin, Clock, Search, Filter, Plus, MessageCircle, Eye, Loader2 } from "lucide-react"
import Link from "next/link"
import { DELIVERY_STATUS, PRIORITY_LEVELS } from "@/lib/constants/api"

export function MyRequests() {
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  
  const { user } = useAuth()
  const { requests, loading, error, loadDeliveryRequests } = useDeliveryRequests({ 
    page: 1, 
    limit: 50, // Get more requests to filter client-side
    autoLoad: true 
  })

  // Filter requests to only show those created by the current user
  const myRequests = useMemo(() => {
    if (!user || !requests) return []
    return requests.filter(request => request.userId === user.id)
  }, [requests, user])

  const filteredRequests = useMemo(() => {
    return myRequests.filter((request) => {
      const matchesFilter = filter === "all" || request.status === filter
      const matchesSearch =
        request.itemDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.dropoffLocation.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesFilter && matchesSearch
    })
  }, [myRequests, filter, searchQuery])

  const getStatusVariant = (status: keyof typeof DELIVERY_STATUS) => {
    const colors = {
      pending: "secondary" as const,
      matched: "default" as const,
      in_transit: "outline" as const,
      delivered: "secondary" as const,
      cancelled: "destructive" as const,
    }
    return colors[status] || "secondary"
  }

  const getPriorityColor = (priority: keyof typeof PRIORITY_LEVELS) => {
    const colors = {
      low: "text-green-600",
      normal: "text-blue-600", 
      high: "text-orange-600",
      urgent: "text-red-600",
    }
    return colors[priority] || "text-gray-600"
  }

  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading your requests...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Requests</h1>
            <p className="text-muted-foreground">Manage your delivery requests and track their progress</p>
          </div>
          <Link href="/dashboard/requests/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Error loading requests</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => loadDeliveryRequests()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Requests</h1>
          <p className="text-muted-foreground">Manage your delivery requests and track their progress</p>
        </div>
        <Link href="/dashboard/requests/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="matched">Matched</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{request.itemDescription}</CardTitle>
                    <Badge variant={getStatusVariant(request.status)}>
                      {DELIVERY_STATUS[request.status]?.label || request.status}
                    </Badge>
                    <Badge variant="outline" className={getPriorityColor(request.priority)}>
                      {PRIORITY_LEVELS[request.priority]?.label || request.priority} priority
                    </Badge>
                  </div>
                  <CardDescription>
                    {request.specialInstructions || "No special instructions provided"}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-primary">
                    GH₵{request.paymentAmount.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {request.itemSize} item
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">From:</span> {request.pickupLocation}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">To:</span> {request.dropoffLocation}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Posted:</span> {new Date(request.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Pickup:</span> {new Date(request.pickupDate).toLocaleDateString()} at {request.pickupTime}
                </div>
              </div>

              {request.contactInfo && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm">
                    <span className="font-medium">Contact info:</span> {request.contactInfo}
                  </div>
                </div>
              )}

              {request.matchedTripId && (
                <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
                  <Package className="h-8 w-8 text-primary" />
                  <div className="flex-1">
                    <div className="font-medium">Matched with Trip</div>
                    <div className="text-sm text-muted-foreground">Trip ID: {request.matchedTripId}</div>
                  </div>
                  <Button size="sm" variant="outline">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat
                  </Button>
                </div>
              )}

              <div className="flex gap-2">
                <Link href={`/dashboard/requests/${request.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </Link>
                {request.status === "pending" && (
                  <Button variant="outline" size="sm" disabled>
                    Edit Request
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRequests.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No requests found</h3>
            <p className="text-muted-foreground mb-4">
              {myRequests.length === 0
                ? "You haven't created any delivery requests yet."
                : filter === "all"
                ? "No requests match your search criteria."
                : `No requests with status "${DELIVERY_STATUS[filter as keyof typeof DELIVERY_STATUS]?.label || filter}" found.`}
            </p>
            <Link href="/dashboard/requests/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {myRequests.length === 0 ? "Create Your First Request" : "Create New Request"}
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your requests...</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
