import connectDB from "./lib/db";
import User from "./lib/models/User";
import Trip from "./lib/models/Trip";
import DeliveryRequest from "./lib/models/DeliveryRequest";

async function initializeDatabase() {
  try {
    console.log("Connecting to database...");
    await connectDB();

    console.log("Database connected successfully!");

    // Optional: Create some sample data for testing
    if (process.env.NODE_ENV === "development") {
      console.log("Creating sample data...");

      // Check if we already have users
      const existingUsers = await User.countDocuments();
      if (existingUsers === 0) {
        console.log(
          "No users found. You can create users through the registration API."
        );
      } else {
        console.log(`Found ${existingUsers} existing users.`);
      }
    }

    console.log("Database initialization complete!");
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  initializeDatabase();
}

export default initializeDatabase;
