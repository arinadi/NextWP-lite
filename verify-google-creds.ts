import { config } from "dotenv";
config({ path: ".env.local" });

async function verifyCredentials() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${process.env.AUTH_URL}/api/auth/callback/google`;

    console.log("Testing credentials...");
    console.log("Client ID:", clientId);
    console.log("Client Secret starts with:", clientSecret?.substring(0, 5) + "...");
    console.log("Redirect URI:", redirectUri);

    // Attempt to exchange a dummy code. 
    // If creds are VALID, Google should say "invalid_grant" (bad code).
    // If creds are INVALID, Google will say "invalid_client".

    const params = new URLSearchParams();
    params.append("client_id", clientId!);
    params.append("client_secret", clientSecret!);
    params.append("code", "dummy_code_to_test_creds");
    params.append("grant_type", "authorization_code");
    params.append("redirect_uri", redirectUri);

    try {
        const response = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params
        });

        const data = await response.json();
        console.log("\n--- Google API Response ---");
        console.log(JSON.stringify(data, null, 2));

        if (data.error === "invalid_client") {
            console.error("\n❌ DIAGNOSIS: The Client ID or Client Secret is WRONG/REVOKED.");
        } else if (data.error === "invalid_grant") {
            console.log("\n✅ DIAGNOSIS: Credentials are VALID (Client ID/Secret accepted). The previous error was due to the flow/code.");
        } else {
            console.log("\n⚠️ DIAGNOSIS: Unexpected response. Check logs.");
        }

    } catch (error) {
        console.error("Network error:", error);
    }
}

verifyCredentials();
