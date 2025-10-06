import { Header } from "components";
import React from "react";
import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import type { Route } from "./+types/create-trip";

export const loader = async () => {
  const response = await fetch(
    "https://countriesnow.space/api/v0.1/countries/positions"
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch countries: ${response.status}`);
  }
  const data = await response.json();

  console.log("Fetched data:", data);

  if (!Array.isArray(data.data)) {
    throw new Error("Unexpected API response: not an array");
  }

  return data.data.map((country: any) => ({
    name: country.name,
    coordinates: [country.lat, country.long],
    value: country.iso2,
    openStreetMap: country,
  }));
};

const CreatedTrips = ({ loaderData }: Route.ComponentProps) => {
  const handleSubmit = async () => {};
  const handleChange = (key: keyof TripFormData, value: string | number) => {};
  const countries = loaderData as Country[];

  const countryData = countries.map((country) => ({
    text: country.name,
    value: country.value,
  }));

  return (
    <main className="flex flex-col gap-10 pb-20 wrapper">
      <Header
        title="Add a New Trip"
        description="View and edit AI Generated travel plans"
      />
      <section className="mt-2.5 wrapper-md">
        <form className="trip-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="country">Country</label>
            <ComboBoxComponent
              id="country"
              dataSource={countryData}
              fields={{ text: "text", value: "value" }}
              placeholder="Select a country"
              className="combo-box"
              change={(e: { value: string | undefined }) => {
                if (e.value) {
                  handleChange("country", e.value);
                }
              }}
              allowFiltering
              filtering={(e) => {
                const query = e.text.toLowerCase();

                e.updateData(
                  countries
                    .filter((country) =>
                      country.name.toLowerCase().includes(query)
                    )
                    .map((country) => ({
                      text: country.name,
                      value: country.value,
                    }))
                );
              }}
            />
          </div>
        </form>
      </section>
    </main>
  );
};

export default CreatedTrips;
