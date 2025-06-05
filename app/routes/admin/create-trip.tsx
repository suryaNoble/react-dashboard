import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import { Header } from "components";
import React, { useState } from "react";
import type { Route } from "./+types/create-trip";
import { comboBoxItems, selectItems, travelStyles } from "~/constants";
import { cn, formatKey } from "~/lib/utils";
import {
  animate,
  LayerDirective,
  LayersDirective,
  MapsComponent,
} from "@syncfusion/ej2-react-maps";
import { world_map } from "~/constants/world_map";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { account } from "~/appwrite/client";
import { redirect, useNavigate } from "react-router";

export const loader = async () => {
  const response = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,latlng,maps"
  );
  const data = await response.json();

  return data.map((country: any) => ({
    name: country.name.common,
    coordinates: country.latlng,
    value: country.name.common,
    openStreetMap: country.maps?.openStreetMap ?? "no map available",
  }));
};

const CreateTrip = ({ loaderData }: Route.ComponentProps) => {
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);

      const user = await account.get();
      if (!user.$id) {
        console.error("user is not logged in!");
        setError("User not authenticated. Please log in.");
        setLoading(false);
        redirect("/sign-in");
        return;
      }

      if (
        !formData.country ||
        !formData.travelStyle ||
        !formData.interest ||
        !formData.budget ||
        !formData.duration ||
        !formData.groupType
      ) {
        setError("Please fill all the fields.");
        setLoading(false);
        return;
      }

      if (formData.duration < 1 || formData.duration > 30) {
        setError("Duration should be between 1 and 30 days.");
        setLoading(false);
        return;
      }
      console.log(formData);
      console.log("this si console trying to print the user");
      console.log(user);

      const { country, duration, travelStyle, interest, budget, groupType } =
        formData;

      const response = await fetch("/api/create-trip", {
        method: "POST",
        headers: { "Content-Type": "application/JSON" },
        body: JSON.stringify({
          country,
          numberOfDays: duration,
          travelStyle,
          interests: interest,
          budget,
          groupType,
          userId: user.$id,
        }),
      });

      const result: CreateTripResponse = await response.json();
      if (result?.id) navigate(`/trips/${result.id}`);
      else {
        console.log("failed to generate trip error in create trip.tsx line 87");
      }
    } catch (error) {
      console.log(error);
      console.error("Cannot Create Trip!");
    } finally {
      setLoading(false);
      return;
    }
  };

  const handleChange = (key: keyof TripFormData, value: string | number) => {
    setFormData({ ...formData, [key]: value });
  };

  //   console.log(loaderData);
  const countries = loaderData as Country[];

  const [formData, setFormData] = useState<TripFormData>({
    country: countries[0]?.name || "",
    travelStyle: "",
    interest: "",
    budget: "",
    duration: 0,
    groupType: "",
  });

  const countryData = countries.map((country) => ({
    text: country.name,
    value: country.value,
  }));

  const mapData = [
    {
      country: formData.country,
      color: "#EA382E",
      coordinates:
        countries.find((country) => country.name === formData.country)
          ?.coordinates || [],
    },
  ];

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <main className="flex flex-col gap-10 pb-20 wrapper">
      <Header
        title="Add a New  Trip"
        description="View and Edit trip using AI-generated suggestions."
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
              onChange={(e: { value: string | undefined }) => {
                if (e.value) {
                  handleChange("country", e.value);
                }
              }}
              //   allowfiltering is a bolen value and filtering is a filter functin it is not necessary filtering automatically works but it eliminates non matching keywords
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
          <div>
            <input
              type="number"
              id="duration"
              name="duration"
              placeholder="Enter No.Of Days:"
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
                placeholder={`Select ${formatKey(key)}`}
                onChange={(e: { value: string | undefined }) => {
                  if (e.value) {
                    handleChange(key, e.value);
                  }
                }}
                //   allowfiltering is a bolen value and filtering is a filter functin it is not necessary filtering automatically works but it eliminates non matching keywords
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
            <label htmlFor="map"></label>
            <MapsComponent>
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
                src={`/assets/icons/${
                  loading ? "loader.svg" : "magic-star.svg"
                }`}
                alt="loading..."
                className={cn("size-5", { "animate-spin": loading })}
              />
              <span className="p-16-semibold text-white">
                {loading ? "Creating..." : "Create Trip"}
              </span>
            </ButtonComponent>
          </footer>
        </form>
      </section>
    </main>
  );
};

export default CreateTrip;
