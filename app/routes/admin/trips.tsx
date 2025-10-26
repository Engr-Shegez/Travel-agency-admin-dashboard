import { Header, TripCard } from "components";
import { useSearchParams, type LoaderFunctionArgs } from "react-router";
import { getAllTrips, getTripById } from "~/appwrite/trips";
import { parseTripData } from "~/lib/utils";
import type { Route } from "./+types/trips";
import { useState } from "react";
import { PagerComponent } from "@syncfusion/ej2-react-grids";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const limit = 4;
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const offset = (page - 1) * limit;

  const { allTrips, total } = await getAllTrips(limit, offset);

  return {
    trips: allTrips.map(({ $id, tripDetail, imageUrls }) => {
      const parsedTrip = parseTripData(tripDetail);
      console.log("Parsed trip:", parsedTrip);
      return {
        id: $id,
        ...parsedTrip,
        imageUrls: imageUrls ?? [],
      };
    }),
    total,
  };
};

const Trips = ({ loaderData }: Route.ComponentProps) => {
  const trips = loaderData.trips as Trip[] | [];

  // Debug: Log first trip to see data structure
  if (trips.length > 0) {
    console.log("First trip data:", trips[0]);
    console.log("Trip name:", trips[0].name);
    console.log("Trip itinerary:", trips[0].itinerary);
    console.log("Trip imageUrls:", trips[0].imageUrls);
    console.log("Trip interests:", trips[0].interests);
    console.log("Trip travelStyle:", trips[0].travelStyle);
  }

  const [searchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page") || "1");

  const [currentPage, setCurrentPage] = useState(initialPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.location.search = `?page=${page}`;
  };
  return (
    <main className="all-users wrapper">
      <Header
        title="Trips"
        description="View and edit AI-generated travel plans"
        ctaText="Create a trip"
        ctaUrl="/admin/trips/create"
      />

      <section>
        <h1 className="p-24-semibold text-dark-100 mb-4">
          Manage Created Trips
        </h1>

        <div className="trip-grid mb-4">
          {trips.map((trip) => (
            <TripCard
              id={trip.id}
              key={trip.id}
              name={trip.name ?? "Untitled Trip"}
              location={
                trip.itinerary?.[0]?.location ??
                trip.location?.city ??
                "Unknown location"
              }
              imageUrl={trip.imageUrls?.[0] ?? "/assets/images/sample.jpeg"}
              tags={
                trip.interests && trip.travelStyle
                  ? [trip.interests, trip.travelStyle]
                  : []
              }
              price={trip.estimatedPrice ?? "$0"}
            />
          ))}
        </div>

        <PagerComponent
          totalRecordsCount={loaderData.total}
          pageSize={4}
          currentPage={currentPage}
          click={(args) => handlePageChange(args.currentPage)}
          cssClass="!mb-4"
        />
      </section>
    </main>
  );
};

export default Trips;
