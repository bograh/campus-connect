import { TripDetails } from "@/components/trips/trip-details"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

export default function TripDetailsPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <TripDetails tripId={params.id} />
    </DashboardLayout>
  )
}
