import mongoose, { Document, Schema } from "mongoose";

export interface ILocation {
  type: "campus" | "off-campus";
  campusLocation?: string;
  offCampusAddress?: string;
}

export interface ITrip extends Document {
  travelerId: mongoose.Types.ObjectId;
  fromLocation: ILocation;
  toLocation: ILocation;
  departureTime: Date;
  transportMethod: string;
  maxDeliveries: number;
  currentDeliveries: number;
  pricePerDelivery: number; // Price in Ghana Cedi (GHC)
  isRecurring: boolean;
  status: "active" | "completed" | "cancelled";
  matchedRequests: mongoose.Types.ObjectId[];
  joinedUsers: mongoose.Types.ObjectId[];
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

const TripSchema = new Schema<ITrip>(
  {
    travelerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Traveler ID is required"],
    },
    fromLocation: {
      type: LocationSchema,
      required: [true, "From location is required"],
    },
    toLocation: {
      type: LocationSchema,
      required: [true, "To location is required"],
    },
    departureTime: {
      type: Date,
      required: [true, "Departure time is required"],
    },
    transportMethod: {
      type: String,
      required: [true, "Transport method is required"],
      enum: ["Car", "Motorcycle", "Bicycle", "Walking", "Public Transport"],
    },
    maxDeliveries: {
      type: Number,
      required: [true, "Maximum deliveries is required"],
      min: [1, "Maximum deliveries must be at least 1"],
      max: [10, "Maximum deliveries cannot exceed 10"],
    },
    currentDeliveries: {
      type: Number,
      default: 0,
      min: 0,
    },
    pricePerDelivery: {
      type: Number,
      required: [true, "Price per delivery is required"],
      min: [0, "Price cannot be negative"],
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    matchedRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "DeliveryRequest",
      },
    ],
    joinedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
TripSchema.index({ travelerId: 1 });
TripSchema.index({ status: 1 });
TripSchema.index({ departureTime: 1 });
TripSchema.index({ "fromLocation.type": 1, "fromLocation.campusLocation": 1 });
TripSchema.index({ "toLocation.type": 1, "toLocation.campusLocation": 1 });

export default mongoose.models.Trip ||
  mongoose.model<ITrip>("Trip", TripSchema);
