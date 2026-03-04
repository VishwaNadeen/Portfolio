import mongoose from "mongoose";

export async function connectDB(uri: string) {
  mongoose.set("strictQuery", true);

  await mongoose.connect(uri, {
    dbName: "Portfolio", //Force DB name
  });

  console.log("MongoDB is connected ✅ DB:", mongoose.connection.name);
}