import { GoogleGenerativeAI } from "@google/generative-ai";
import { ID } from "appwrite";
import { data, type ActionFunctionArgs } from "react-router";
import { appwriteConfig, database } from "~/appwrite/client";
import { parseMarkdownToJson } from "~/lib/utils";

// Add loader to handle GET requests (for debugging)
export const loader = () => {
  console.log("API route /api/create-trip was accessed via GET");
  return data(
    { message: "This endpoint only accepts POST requests" },
    { status: 405 }
  );
};

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log(
    "API route /api/create-trip was called with method:",
    request.method
  );
  // Server-side: use process.env
  const geminiKey = process.env.GEMINI_API_KEY;
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!geminiKey) {
    console.error(
      "GEMINI_API_KEY not found. Available env keys:",
      Object.keys(process.env).filter(
        (k) => k.includes("GEMINI") || k.includes("API")
      )
    );
    return data(
      {
        error:
          "GEMINI_API_KEY is not set. Please check your .env.local file has GEMINI_API_KEY.",
      },
      { status: 500 }
    );
  }

  if (!unsplashKey) {
    console.error(
      "UNSPLASH_ACCESS_KEY not found. Available env keys:",
      Object.keys(process.env).filter((k) => k.includes("UNSPLASH"))
    );
    return data(
      {
        error:
          "UNSPLASH_ACCESS_KEY is not set. Please check your .env.local file has UNSPLASH_ACCESS_KEY.",
      },
      { status: 500 }
    );
  }

  const {
    country,
    numberOfDays,
    travelStyle,
    interests,
    budget,
    groupType,
    userId,
  } = await request.json();

  const genAI = new GoogleGenerativeAI(geminiKey);
  const unsplashApiKey = unsplashKey;

  try {
    const prompt = `Generate a ${numberOfDays}-day travel itinerary for ${country} based on the following user information:
    Budget: '${budget}'
    Interests: '${interests}'
    TravelStyle: '${travelStyle}'
    GroupType: '${groupType}'
    Return the itinerary and lowest estimated price in a clean, non-markdown JSON format with the following structure:
    {
    "name": "A descriptive title for the trip",
    "description": "A brief description of the trip and its highlights not exceeding 100 words",
    "estimatedPrice": "Lowest average price for the trip in USD, e.g.$price",
    "duration": ${numberOfDays},
    "budget": "${budget}",
    "travelStyle": "${travelStyle}",
    "country": "${country}",
    "interests": ${interests},
    "groupType": "${groupType}",
    "bestTimeToVisit": [
      '🌸 Season (from month to month): reason to visit',
      '☀️ Season (from month to month): reason to visit',
      '🍁 Season (from month to month): reason to visit',
      '❄️ Season (from month to month): reason to visit'
    ],
    "weatherInfo": [
      '☀️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
      '🌦️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
      '🌧️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
      '❄️ Season: temperature range in Celsius (temperature range in Fahrenheit)'
    ],
    "location": {
      "city": "name of the city or region",
      "coordinates": [latitude, longitude],
      "openStreetMap": "link to open street map"
    },
    "itinerary": [
    {
      "day": 1,
      "location": "City/Region Name",
      "activities": [
        {"time": "Morning", "description": "🏰 Visit the local historic castle and enjoy a scenic walk"},
        {"time": "Afternoon", "description": "🖼️ Explore a famous art museum with a guided tour"},
        {"time": "Evening", "description": "🍷 Dine at a rooftop restaurant with local wine"}
      ]
    },
    ...
    ]
    }`;

    // Add retry logic for rate limiting
    let textResult;
    let retries = 3;
    let lastError;

    while (retries > 0) {
      try {
        textResult = await genAI
          .getGenerativeModel({
            model: "gemini-2.0-flash",
          })
          .generateContent([prompt]);
        break; // Success, exit retry loop
      } catch (error: any) {
        lastError = error;
        // Check if it's a rate limit error (429)
        if (
          error.message?.includes("429") ||
          error.message?.includes("RATE_LIMIT")
        ) {
          retries--;
          if (retries > 0) {
            console.log(
              `Rate limit hit, retrying... (${retries} retries left)`
            );
            // Wait before retrying (exponential backoff)
            await new Promise((resolve) =>
              setTimeout(resolve, 2000 * (4 - retries))
            );
            continue;
          }
          // No retries left, throw a user-friendly error
          throw new Error(
            "API rate limit exceeded. Please wait a minute and try again."
          );
        }
        // Not a rate limit error, throw immediately
        throw error;
      }
    }

    if (!textResult) {
      throw (
        lastError || new Error("Failed to generate content from Gemini API")
      );
    }

    const trip = parseMarkdownToJson(textResult.response.text());

    const imageResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${country} ${interests} ${travelStyle}&client_id=${unsplashApiKey}`
    );

    const imageUrls = (await imageResponse.json()).results
      .slice(0, 3)
      .map((result: any) => result.urls?.regular || null);

    const result = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.tripCollectionId,
      ID.unique(),
      {
        tripDetail: JSON.stringify(trip),
        createdAt: new Date().toISOString(),
        imageUrls,
        userId,
      }
    );

    return data({ id: result.$id });
  } catch (e) {
    console.error("Error generating travel plan: ", e);
    let errorMessage = "An unknown error occurred";

    if (e instanceof Error) {
      // Provide user-friendly error messages
      if (
        e.message.includes("rate limit") ||
        e.message.includes("429") ||
        e.message.includes("RATE_LIMIT")
      ) {
        errorMessage =
          "API rate limit exceeded. Please wait a minute and try again.";
      } else if (e.message.includes("quota")) {
        errorMessage =
          "You've exceeded your API quota. Please wait a moment and try again.";
      } else {
        errorMessage = e.message;
      }
    }

    return data({ error: errorMessage }, { status: 500 });
  }
};
