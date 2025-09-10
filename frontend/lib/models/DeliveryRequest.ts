import mongoose, { Document, Schema } from "mongoose";

export interface ILocation {
  type: "campus" | "off-campus";
  campusLocation?: string;
  offCampusAddress?: string;
}

export interface IDeliveryRequest extends Document {
  userId: mongoose.Types.ObjectId;
  pickupLocation: ILocation;
  dropoffLocation: ILocation;
  itemDescription: string;
  itemSize: "Small" | "Medium" | "Large";
  priority: "normal" | "high" | "urgent";
  paymentAmount: number; // Payment in Ghana Cedi (GHC)
  pickupDate: Date;
  pickupTime: string;
  contactInfo: string;
  specialInstructions: string;
  status: "pending" | "matched" | "in-transit" | "delivered" | "cancelled";
  matchedTripId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema = new Schema<ILocation>(
  {
    type: {
      type: String,
      enum: ["campus", "off-campus"],
      required: true,
    },
    campusLocation: {
      type: String,
      required: function () {
        return this.type === "campus";
      },
    },
    offCampusAddress: {
      type: String,
      required: function () {
        return this.type === "off-campus";
      },
    },
  },
  { _id: false }
);

const DeliveryRequestSchema = new Schema<IDeliveryRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    pickupLocation: {
      type: LocationSchema,
      required: [true, "Pickup location is required"],
    },
    dropoffLocation: {
      type: LocationSchema,
      required: [true, "Dropoff location is required"],
    },
    itemDescription: {
      type: String,
      required: [true, "Item description is required"],
      trim: true,
      maxlength: [200, "Item description cannot exceed 200 characters"],
    },
    itemSize: {
      type: String,
      required: [true, "Item size is required"],
      enum: ["Small", "Medium", "Large"],
    },
    priority: {
      type: String,
      enum: ["normal", "high", "urgent"],
      default: "normal",
    },
    paymentAmount: {
      type: Number,
      required: [true, "Payment amount is required"],
      min: [0, "Payment amount cannot be negative"],
    },
    pickupDate: {
      type: Date,
      required: [true, "Pickup date is required"],
    },
    pickupTime: {
      type: String,
      required: [true, "Pickup time is required"],
    },
    contactInfo: {
      type: String,
      required: [true, "Contact info is required"],
      trim: true,
    },
    specialInstructions: {
      type: String,
      trim: true,
      maxlength: [500, "Special instructions cannot exceed 500 characters"],
    },
    status: {
      type: String,
      enum: ["pending", "matched", "in-transit", "delivered", "cancelled"],
      default: "pending",
    },
    matchedTripId: {
      type: Schema.Types.ObjectId,
      ref: "Trip",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
DeliveryRequestSchema.index({ userId: 1 });
DeliveryRequestSchema.index({ status: 1 });
DeliveryRequestSchema.index({ pickupDate: 1 });
DeliveryRequestSchema.index({
  "pickupLocation.type": 1,
  "pickupLocation.campusLocation": 1,
});
DeliveryRequestSchema.index({
  "dropoffLocation.type": 1,
  "dropoffLocation.campusLocation": 1,
});
DeliveryRequestSchema.index({ matchedTripId: 1 });

export default mongoose.models.DeliveryRequest ||
  mongoose.model<IDeliveryRequest>("DeliveryRequest", DeliveryRequestSchema);
