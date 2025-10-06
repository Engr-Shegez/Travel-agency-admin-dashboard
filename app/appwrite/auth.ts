import { OAuthProvider, Query, ID, Databases } from "appwrite";
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

    try {
      const { documents, total } = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [
          Query.equal("accountId", user.$id),
          Query.select(["name", "email", "imageUrl", "joinedAt", "accountId"]),
        ]
      );

      if (total > 0 && Array.isArray(documents) && documents.length > 0) {
        return documents[0];
      }
    } catch (listError) {
      console.error("Error listing user documents:", listError);
      // Continue and try to fall back / create
    }

    // No existing user in DB - create one and return it (storeUserData handles errors/logging)
    const created = await storeUserData();
    if (created) return created;

    // As a last resort, return a lightweight shape from the account to avoid nulls in UI
    return {
      name: user.name || "",
      email: user.email || "",
      imageUrl: (user as any)?.prefs?.photo || null,
      accountId: user.$id,
    } as any;
  } catch (e) {
    console.log(e);
    // If account call itself failed, ensure we navigate to sign-in rather than returning undefined
    return redirect("/sign-in");
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

    console.log("Creating user in database:", {
      accountId: user.$id,
      email: user.email,
      name: user.name,
    });

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

    console.log("User created successfully:", createdUser);

    if (!createdUser.$id) redirect("/sign-in");

    // Return the created user document so callers (route loaders) receive the user data
    return createdUser;
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

export const getAllUsers = async (limit: number, offset: number) => {
  try {
    console.log("Fetching users with config:", {
      databaseId: appwriteConfig.databaseId,
      userCollectionId: appwriteConfig.userCollectionId,
      limit,
      offset,
    });

    const { documents: users, total } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.limit(limit), Query.offset(offset)]
    );

    console.log("Users fetched:", { users, total });

    if (total === 0) {
      console.log("No users found in database");
      return { users: [], total };
    }
    return { users, total };
  } catch (e) {
    console.error("Error Fetching users:", e);
    return { users: [], total: 0 };
  }
};
