import { type RouteConfig, layout, route } from "@react-router/dev/routes";

export default [
  route("sign-in", "routes/root/sign-in.tsx"),
  // route("*", "routes/root/sign-in.tsx"),
  route("sign-up", "routes/root/sign-up.tsx"),
  layout("routes/admin/admin-layout.tsx", [
    route("dashboard", "routes/admin/dashboard.tsx"),
    route("all-users", "routes/admin/all-users.tsx"),
    route("trips/create", "routes/admin/create-trip.tsx"),
    route("trips", "routes/admin/trips.tsx"),
  ]),
  route("api/create-trip", "routes/api/create-trip.ts"),
  route("trips/:tripId", "routes/admin/trip-detail.tsx"),
] satisfies RouteConfig;
