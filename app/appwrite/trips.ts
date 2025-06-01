import { Query } from "appwrite";
import { appwriteConfig, database } from "./client";

export const getAllTrips = async (limit: number, offset: number) => {
  const allTrips = await database.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.tripCollectionId,
    [Query.limit(limit), Query.offset(offset), Query.orderDesc("createdAt")]
  );

  if (allTrips.total === 0) {
    console.log("No trips found in trips.ts in app/appwrite/trips.ts");
    return {
      allTrips: [],
      total: 0,
    };
  }

  return {
    allTrips: allTrips.documents,
    total: allTrips.total,
  };
};

export const getTripById = async (tripId: string) => {
  const trip = await database.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.tripCollectionId,
    tripId
  );

  if (!trip || !trip.$id) {
    console.log(`Trip with ID ${tripId} not found in trips.ts`);
    return null;
  }

  return trip;
};
