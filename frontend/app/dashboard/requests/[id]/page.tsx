import { RequestDetails } from "@/components/requests/request-details"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

export default function RequestDetailsPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <RequestDetails requestId={params.id} />
    </DashboardLayout>
  )
}
