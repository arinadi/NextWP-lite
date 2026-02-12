import { config } from "dotenv";
config({ path: ".env.local" });

console.log("GOOGLE_CLIENT_ID loaded:", !!process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_ID length:", process.env.GOOGLE_CLIENT_ID?.length);
console.log("GOOGLE_CLIENT_SECRET loaded:", !!process.env.GOOGLE_CLIENT_SECRET);
console.log("GOOGLE_CLIENT_SECRET length:", process.env.GOOGLE_CLIENT_SECRET?.length);
console.log("AUTH_URL:", process.env.AUTH_URL);
