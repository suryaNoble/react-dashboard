import { Header } from "components";

const Trips = () => {
  return (
    <main className="all-users wrapper">
      <Header
        title="Trips"
        description="AI geerated trips for you."
        ctaText="Create a trip"
        ctaUrl="/trips/create"
      />
    </main>
  );
};

export default Trips;
