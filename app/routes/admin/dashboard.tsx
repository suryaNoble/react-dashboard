import { Header } from "components";

const dashboard = () => {
  const user = { name: "Noble" };
  return (
    <main className="dashboard wrapper">
      <Header
        title={`hi there ${user?.name ?? "Guest"}`}
        description="Here is your data."
      />
      Dashboard page content
    </main>
  );
};

export default dashboard;
