import { ID } from "appwrite";

const getEnv = (primary: string, fallback?: string) =>
  process.env[primary] ?? (fallback ? process.env[fallback] : undefined);

const getRequiredEnv = (primary: string, fallback?: string) => {
  const value = getEnv(primary, fallback);

  if (!value) {
    throw new Error(
      `${primary} is not set${fallback ? ` (or ${fallback})` : ""}.`
    );
  }

  return value;
};

export const getServerAppwrite = () => {
  const endpointUrl = getRequiredEnv(
    "APPWRITE_API_ENDPOINT",
    "VITE_APPWRITE_API_ENDPOINT"
  );
  const projectId = getRequiredEnv(
    "APPWRITE_PROJECT_ID",
    "VITE_APPWRITE_PROJECT_ID"
  );
  const apiKey = getRequiredEnv("APPWRITE_API_KEY", "VITE_APPWRITE_API_KEY");
  const databaseId = getRequiredEnv(
    "APPWRITE_DATABASE_ID",
    "VITE_APPWRITE_DATABASE_ID"
  );
  const tripCollectionId = getRequiredEnv(
    "APPWRITE_TRIPS_TABLE_ID",
    "VITE_APPWRITE_TRIPS_TABLE_ID"
  );

  return {
    config: {
      endpointUrl,
      projectId,
      apiKey,
      databaseId,
      tripCollectionId,
    },
    createTripDocument: async (data: Record<string, unknown>) => {
      const response = await fetch(
        `${endpointUrl}/databases/${databaseId}/collections/${tripCollectionId}/documents`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Appwrite-Project": projectId,
            "X-Appwrite-Key": apiKey,
          },
          body: JSON.stringify({
            documentId: ID.unique(),
            data,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(
          `Appwrite request failed with status ${response.status}${
            errorText ? `: ${errorText}` : ""
          }`
        );
      }

      return response.json();
    },
  };
};
