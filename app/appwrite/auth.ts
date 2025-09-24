import { OAuthProvider, Query, ID } from "appwrite";
import { account, appwriteConfig, database } from "./client";
import { redirect } from "react-router";

export const loginWithGoogle = async () => {
  try {
    account.createOAuth2Session(
      OAuthProvider.Google,
      `${window.location.origin}/`,
      `${window.location.origin}/404`
    );
  } catch (error) {
    console.error("Error during OAuth2 session creation:", error);
  }
};

export const getUser = async () => {
  try {
    const user = await account.get();

    if (!user) return redirect("/sign-in");

    const { documents } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [
        Query.equal("accountId", user.$id),
        Query.select(["name", "email", "imageUrl", "joinedAt", "accountId"]),
      ]
    );
  } catch (e) {
    console.log(e);
  }
};

export const logoutUser = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

export const getGooglePicture = async (
  accessToken?: string
): Promise<string | null> => {
  try {
    // Determine the OAuth token to use: prefer the provided one, otherwise read current session
    let oAuthToken = accessToken;
    if (!oAuthToken) {
      const session = await account.getSession("current").catch(() => null);
      oAuthToken = (session as any)?.providerAccessToken;
    }

    if (!oAuthToken) {
      console.log("No OAuth token available");
      return null;
    }

    // Request the profile photos from Google People API
    const response = await fetch(
      "https://people.googleapis.com/v1/people/me?personFields=photos",
      { headers: { Authorization: `Bearer ${oAuthToken}` } }
    );

    if (!response.ok) {
      // Log response body for easier debugging (non-blocking)
      const body = await response.text().catch(() => "");
      console.error(
        `Google People API returned ${response.status}: ${response.statusText}`,
        body
      );
      return null;
    }

    const data = await response.json().catch(() => null);
    const photos = (data && data.photos) || [];

    if (!Array.isArray(photos) || photos.length === 0) return null;

    // Prefer the primary photo if available
    const primary = photos.find((p: any) => p?.metadata?.primary) || photos[0];
    const photoUrl = primary?.url || null;

    return photoUrl;
  } catch (e) {
    console.error("Error fetching Google picture:", e);
    return null;
  }
};

export const storeUserData = async () => {
  try {
    const user = await account.get();
    if (!user) throw new Error("User not found");

    const { providerAccessToken } = (await account.getSession("current")) || {};
    const profilePicture = providerAccessToken
      ? await getGooglePicture(providerAccessToken)
      : null;

    const createdUser = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: user.$id,
        email: user.email,
        name: user.name,
        imageUrl: profilePicture,
        joinedAt: new Date().toISOString(),
      }
    );

    if (!createdUser.$id) redirect("/sign-in");
  } catch (error) {
    console.error("Error storing user data:", error);
  }
};

export const getExistingUser = async (id: string) => {
  try {
    const { documents, total } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", id)]
    );
    return total > 0 ? documents[0] : null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
