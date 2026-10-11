import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const mongoUri = process.env.BETTER_AUTH_MONGODB_URI;

if (!mongoUri) {
  throw new Error("BETTER_AUTH_MONGODB_URI is not defined");
}

const client = new MongoClient(mongoUri);
const db = client.db("better-auth-project");

export const auth = betterAuth({
    emailAndPassword: { 
    enabled: true, 
  }, 
  database: mongodbAdapter(db, {
    client,
  }),
});