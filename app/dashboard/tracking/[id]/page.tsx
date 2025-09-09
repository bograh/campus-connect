import { DeliveryDetails } from "@/components/tracking/delivery-details"

interface TrackingDetailsPageProps {
  params: {
    id: string
  }
}

export default function TrackingDetailsPage({ params }: TrackingDetailsPageProps) {
  return <DeliveryDetails deliveryId={params.id} />
}
