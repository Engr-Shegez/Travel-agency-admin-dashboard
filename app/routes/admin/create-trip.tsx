import { Header } from "components";
import React, { useState } from "react";
import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import type { Route } from "./+types/create-trip";
import {
  comboBoxItems,
  interests,
  selectItems,
  travelStyles,
  user,
} from "~/constants";
import { cn, formatKey } from "~/lib/utils";
import {
  LayerDirective,
  LayersDirective,
  MapsComponent,
} from "@syncfusion/ej2-react-maps";
import { world_map } from "~/constants/world_map";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { account } from "~/appwrite/client";
import { useNavigate } from "react-router";

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
    // use country name as the value so it matches the world_map feature 'name'
    value: country.name,
    openStreetMap: country,
  }));
};

const CreatedTrips = ({ loaderData }: Route.ComponentProps) => {
  const countries = loaderData as Country[];
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TripFormData>({
    country: countries[0]?.name || "",
    travelStyle: "",
    interest: "",
    budget: "",
    duration: 0,
    groupType: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (
      !formData.country ||
      !formData.travelStyle ||
      !formData.interest ||
      !formData.budget ||
      !formData.groupType
    ) {
      setError("Please Provide values for all the fields");
      setLoading(false);
      return;
    }

    if (formData.duration < 1 || formData.duration > 10) {
      setError("Duration must be between 1 and 10 days ");
      setLoading(false);
      return;
    }

    const user = await account.get();
    if (!user.$id) {
      console.error("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/create-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: formData.country,
          numberOfDays: formData.duration,
          travelStyle: formData.travelStyle,
          interests: formData.interest,
          budget: formData.budget,
          groupType: formData.groupType,
          userId: user.$id,
        }),
      });

      // Clone the response to read it once
      const clonedResponse = response.clone();
      const contentType = response.headers.get("content-type");

      // Check if response is OK
      if (!response.ok) {
        let errorMessage = "Failed to generate trip";

        // Try to parse as JSON first
        if (contentType && contentType.includes("application/json")) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch {
            // If JSON parsing fails, try text
            try {
              const text = await clonedResponse.text();
              errorMessage = text.substring(0, 200); // Limit error message length
            } catch {
              errorMessage = `${response.status} ${response.statusText}`;
            }
          }
        } else {
          // Not JSON, try to read as text
          try {
            const text = await response.text();
            errorMessage = text.substring(0, 200);
          } catch {
            errorMessage = `${response.status} ${response.statusText}`;
          }
        }

        setError(errorMessage);
        setLoading(false);
        return;
      }

      // Response is OK, parse as JSON
      try {
        const result: CreateTripResponse = await response.json();

        if (result?.error) {
          setError(result.error);
        } else if (result?.id) {
          navigate(`/admin/trips/${result.id}`);
        } else {
          setError("Failed to generate a trip");
        }
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        setError("Received invalid response from server");
      }
    } catch (e) {
      console.error("Error generating trip", e);
      setError(
        "An error occurred while generating the trip. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (key: keyof TripFormData, value: string | number) => {
    setFormData({ ...formData, [key]: value });
  };

  const countryData = countries.map((country) => ({
    text: country.name,
    // use the country name as the ComboBox value so selected value
    // matches the world_map shape 'name' property used by the map
    value: country.name,
  }));

  const mapData = [
    {
      country: formData.country,
      color: "#EA3820",
      coordinates:
        countries.find((c: Country) => c.name === formData.country)
          ?.coordinates || [],
    },
  ];

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
              // keep the ComboBox UI value in sync with component state
              value={formData.country}
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
                      // keep filtered value consistent with ComboBox 'value'
                      // (we use the country name to match the map)
                      value: country.name,
                    }))
                );
              }}
            />
          </div>

          <div>
            <label htmlFor="duration">Duration</label>
            <input
              id="duration"
              name="duration"
              type="number"
              placeholder="Enter a number of days (5, 12, 15....)"
              className="form-input placeholder:text-gray-100"
              onChange={(e) => handleChange("duration", Number(e.target.value))}
            />
          </div>

          {selectItems.map((key) => (
            <div key={key}>
              <label htmlFor={key}>{formatKey(key)}</label>

              <ComboBoxComponent
                id={key}
                dataSource={comboBoxItems[key].map((item) => ({
                  text: item,
                  value: item,
                }))}
                fields={{ text: "text", value: "value" }}
                placeholder={`select ${formatKey(key)}`}
                change={(e: { value: string | undefined }) => {
                  if (e.value) {
                    handleChange(key, e.value);
                  }
                }}
                allowFiltering
                filtering={(e) => {
                  const query = e.text.toLowerCase();

                  e.updateData(
                    comboBoxItems[key]
                      .filter((item) => item.toLowerCase().includes(query))
                      .map((item) => ({
                        text: item,
                        value: item,
                      }))
                  );
                }}
                className="combo-box"
              />
            </div>
          ))}

          <div>
            <label htmlFor="location">Location on the World Map</label>
            <MapsComponent key={formData.country}>
              <LayersDirective>
                <LayerDirective
                  shapeData={world_map}
                  dataSource={mapData}
                  shapePropertyPath="name"
                  shapeDataPath="country"
                  shapeSettings={{ colorValuePath: "color", fill: "#E5E5E5" }}
                />
              </LayersDirective>
            </MapsComponent>
          </div>

          <div className="bg-gray-200 h-px w-full" />

          {error && (
            <div className="error">
              <p>{error}</p>
            </div>
          )}
          <footer className="px-6 w-full">
            <ButtonComponent
              type="submit"
              className="button-class !h-12 !w-full"
              disabled={loading}
            >
              <img
                src={`/assets/icons/${loading ? "loader.svg" : "magic-star.svg"}`}
                className={cn("size-5", { "animate-spin": loading })}
              />
              <span className="p-16-semibold text-white">
                {loading ? "Generating..." : "Generate Trip"}
              </span>
            </ButtonComponent>
          </footer>
        </form>
      </section>
    </main>
  );
};

export default CreatedTrips;
