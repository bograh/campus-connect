import { BrowseRequests } from "@/components/requests/browse-requests"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

export default function BrowsePage() {
  return (
    <DashboardLayout>
      <BrowseRequests />
    </DashboardLayout>
  )
}
