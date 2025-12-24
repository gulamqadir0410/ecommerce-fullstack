import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import { User } from "../models/user.model.js";

export const inngest = new Inngest({ id: "my-app" });

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "webhook-integration/user.created" },
  async ({ event }) => {
    await connectDB();

    const { id, email_addresses, first_name, last_name, image_url } =
      event.data;

    const newUser = {
      clerkId: id,
      email: email_addresses?.[0]?.email_address || "",
      name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
      imageUrl: image_url,
      addresses: [],
      wishlist: [],
    };

    await User.findOneAndUpdate(
      { clerkId: id },
      { $setOnInsert: newUser },
      { upsert: true }
    );
  }
);

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "webhook-integration/user.deleted" },
  async ({ event }) => {
    await connectDB();
    await User.deleteOne({ clerkId: event.data.id });
  }
);

export const functions = [syncUser, deleteUserFromDB];
