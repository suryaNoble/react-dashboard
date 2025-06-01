import type { LoaderFunctionArgs } from "react-router";
import { getAllTrips, getTripById } from "~/appwrite/trips";
import type { Route } from "./+types/trip-detail";
import { cn, getFirstWord, parseTripData } from "~/lib/utils";
import { Header, InfoPill, TripCard } from "components";
import {
  ChipDirective,
  ChipListComponent,
  ChipsDirective,
} from "@syncfusion/ej2-react-buttons";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { tripId } = params;
  if (!tripId) {
    throw new Error("Trip ID is required");
  }

  const [trip, trips] = await Promise.all([
    getTripById(tripId),
    getAllTrips(4, 0),
  ]);

  return {
    trip,
    allTrips: trips.allTrips.map(({ $id, tripDetails, imageUrls }) => ({
      id: $id,
      ...parseTripData(tripDetails),
      imageUrls: imageUrls ?? [],
    })),
  };
};

const TripDetail = ({ loaderData }: Route.ComponentProps) => {
  const tripData = parseTripData(loaderData?.trip?.tripDetail || null);
  const imageUrls = loaderData?.trip?.imageUrls || [];

  const {
    name,
    duration,
    itinerary,
    travelStyle,
    groupType,
    budget,
    interests,
    estimatedPrice,
    description,
    bestTimeToVisit,
    weatherInfo,
    country,
  } = tripData || {};

  const allTrips = loaderData.allTrips as Trip[] | [];

  const pillItems = [
    { text: travelStyle, bg: "!bg-pink-50 !text-pink-500" },
    { text: groupType, bg: "!bg-primary-50 !text-primary-500" },
    { text: budget, bg: "!bg-success-50 !text-success-700" },
    { text: interests, bg: "!bg-navy-50 !text-navy-500" },
  ];

  const visitTimeAndWeatherInfo = [
    { title: "Best Time to Visit:", items: bestTimeToVisit },
    { title: "Weather:", items: weatherInfo },
  ];

  return (
    <main className="travel-detail wrapper">
      <div className="w-fit bg-white/60 rounded-2xl shadow-xl p-6 md:p-8   transition-transform duration-300 ease-in-out  hover:translate-y-1 hover:translate-x-1">
        <Header
          title="Trip Details"
          description="View and edit AI-generated travel plans"
        />
      </div>

      <section className="container wrapper-md bg-gray-200 rounded-2xl shadow-[12px_12px_30px_rgba(0,0,0,0.15)] p-6 max-w-3xl mx-auto mt-10 relative transition-transform duration-300 hover:-translate-y-2">
        <header>
          <h1 className="p-40-semibold text-dark-100">{name}</h1>
          <div className="flex items-center gap-5">
            <InfoPill
              text={`${duration} day plan`}
              image="/assets/icons/calendar.svg"
            />

            <InfoPill
              text={
                itinerary
                  ?.slice(0, 4)
                  .map((item) => item.location)
                  .join(", ") || ""
              }
              image="/assets/icons/location-mark.svg"
            />
          </div>
        </header>

        <section className="gallery">
          {imageUrls.map((url: string, i: number) => (
            <img
              src={url}
              key={i}
              className={cn(
                "w-full rounded-xl object-cover transition-transform duration-300 hover:-translate-y-2 bg-amber-100",
                i === 0
                  ? "md:col-span-2 md:row-span-2 h-[330px]"
                  : "md:row-span-1 h-[150px]"
              )}
            />
          ))}
        </section>

        <section className="flex gap-3 md:gap-5 items-center flex-wrap">
          <ChipListComponent id="travel-chip">
            <ChipsDirective>
              {pillItems.map((pill, i) => (
                <ChipDirective
                  key={i}
                  text={getFirstWord(pill.text)}
                  cssClass={`${pill.bg} !text-base !font-medium !px-4`}
                />
              ))}
            </ChipsDirective>
          </ChipListComponent>

          <ul className="flex gap-1 items-center">
            {Array(5)
              .fill("null")
              .map((_, index) => (
                <li key={index}>
                  <img
                    src="/assets/icons/star.svg"
                    alt="star"
                    className="size-[18px]"
                  />
                </li>
              ))}

            <li className="ml-1">
              <ChipListComponent>
                <ChipsDirective>
                  <ChipDirective
                    text="4.9/5"
                    cssClass="!bg-yellow-50 !text-yellow-700"
                  />
                </ChipsDirective>
              </ChipListComponent>
            </li>
          </ul>
        </section>

        <section className="title bg-white rounded-xl shadow-lg p-6 md:p-10 mb-10 transition-all duration-300 hover:shadow-xl">
          <article className="mb-4 space-y-1">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
              {duration}-Day {country} {travelStyle} Trip
            </h3>
            <p className="text-base md:text-lg text-gray-500">
              {budget}, {groupType} and {interests}
            </p>
          </article>

          <h2 className="text-xl md:text-2xl font-semibold text-emerald-600">
            {estimatedPrice}
          </h2>
        </section>

        <p className="text-sm md:text-lg font-normal text-gray-600 mb-8">
          {description}
        </p>

        <ul className="itinerary space-y-6 mb-12">
          {itinerary?.map((dayPlan: DayPlan, index: number) => (
            <li key={index} className="bg-white rounded-lg shadow-md p-5">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">
                Day {dayPlan.day}: {dayPlan.location}
              </h3>

              <ul className="space-y-2">
                {dayPlan.activities.map((activity, index: number) => (
                  <li key={index} className="flex gap-3 items-start">
                    <span className="min-w-[75px] font-medium text-indigo-600">
                      {activity.time}
                    </span>
                    <p className="text-gray-700">{activity.description}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        {visitTimeAndWeatherInfo.map((section) => (
          <section
            key={section.title}
            className="visit bg-sky-50 p-6 rounded-lg shadow-sm mb-6"
          >
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {section.title}
              </h3>

              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {section.items?.map((item) => (
                  <li key={item}>
                    <p className="flex-grow">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </section>

      <section className="flex flex-col gap-6 mt-12">
        <h2 className="p-24-semibold text-2xl text-gray-900">Popular Trips</h2>

        <div className="trip-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allTrips.length > 0
            ? allTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  id={trip.id}
                  name={trip.name}
                  imageUrl={
                    trip.imageUrls?.[0] ??
                    `/assets/images/sample${
                      Math.floor(Math.random() * 4) + 1
                    }.jpg`
                  }
                  location={trip.itinerary?.[0]?.location ?? "Unknown"}
                  tags={[trip.interests, trip.travelStyle]}
                  price={trip.estimatedPrice}
                />
              ))
            : Array.from({ length: 3 }).map((_, i) => (
                <TripCard
                  key={`dummy-${i}`}
                  id={`dummy-${i}`}
                  name="Tropical Paradise"
                  imageUrl={`/assets/images/sample${
                    Math.floor(Math.random() * 4) + 1
                  }.jpg`}
                  location="Maldives"
                  tags={["Beach", "Luxury"]}
                  price="$1499"
                />
              ))}
        </div>
      </section>
    </main>
  );
};

export default TripDetail;
