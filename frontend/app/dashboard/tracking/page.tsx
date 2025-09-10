import { DeliveryTracking } from "@/components/tracking/delivery-tracking";

export default function TrackingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Delivery Tracking</h1>
        <p className="text-muted-foreground">
          Track your active deliveries and trips in real-time
        </p>
      </div>
      <DeliveryTracking />
    </div>
  );
}
