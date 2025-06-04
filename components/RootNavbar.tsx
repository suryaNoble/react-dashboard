import React, { useState } from "react";
import {
  Link,
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";
import { logoutUser } from "~/appwrite/auth";
import { cn } from "~/lib/utils";

const RootNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const user = useLoaderData();
  // console.log("user data:", user);
  // console.log(user.status);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isLoading3, setIsLoading3] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/sign-in");
  };

  return (
    <nav
      className={cn(
        location.pathname === `/travel/${params.tripId}`
          ? "bg-white"
          : "glassmorphism",
        "w-full fixed z-50 "
      )}
    >
      <header className="root-nav wrapper">
        <Link to="/" className="link-logo">
          <img
            src="/assets/icons/logo.svg"
            alt="logo"
            className="size-[30px]"
          />
          <h1>Tourvisto</h1>
        </Link>

        {user.status === "admin" ? (
          <button
            className="cursor-pointer px-8 py-3 text-lg font-semibold rounded-xl   shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform"
            onClick={() => {
              setIsLoading(true);
              navigate("/dashboard");
            }}
          >
            {isLoading ? "navigating..." : "Dashboard"}
          </button>
        ) : (
          <button
            className="cursor-pointer px-8 py-3 text-lg font-semibold rounded-xl  shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform"
            disabled={isLoading}
            onClick={() => {
              setIsLoading(true);
              navigate("/my-trips");
            }}
          >
            {isLoading ? "navigating..." : "My Trips"}
          </button>
        )}

        <button
          className="cursor-pointer px-8 py-3 text-lg font-semibold rounded-xl  shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform"
          onClick={() => {
            setIsLoading2(true);
            navigate("/trips");
          }}
        >
          {isLoading2 ? "Loading..." : "All Trips"}
        </button>
        <button
          className="cursor-pointer px-8 py-3 text-lg font-semibold rounded-xl  shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform"
          onClick={() => {
            setIsLoading3(true);
            navigate("/trips/create");
          }}
        >
          {isLoading3 ? "Loading..." : "Create a trip with AI"}
        </button>

        <aside>
          {user.status === "admin" && (
            <Link
              to="/dashboard"
              className={cn("text-base font-normal text-white", {
                "text-dark-100": location.pathname.startsWith("/travel"),
              })}
            >
              Admin Panel
            </Link>
          )}

          <img
            src={user?.imageUrl || "/assets/images/david.wepb"}
            alt="user"
            referrerPolicy="no-referrer"
          />

          <button onClick={handleLogout} className="cursor-pointer">
            <img
              src="/assets/icons/logout.svg"
              alt="logout"
              className="size-6 rotate-180"
            />
          </button>
        </aside>
      </header>
      <div className="p-5 root-nav wrapper  relative h-screen w-full bg-[url('/assets/images/hero-img.png')] bg-cover bg-center bg-no-repeat bg-fixed rounded-2xl">
        <div className=" p-8 absolute inset-0 bg-black/50 flex flex-row items-center justify-between rounded-2xl"></div>
      </div>
    </nav>
  );
};
export default RootNavbar;

// a generic button if use;
// // <button
//             className="cursor-pointer px-8 py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-amber-800 to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform"
//             onClick={() => navigate("/my-trips")}
//           >
//             My Trips
//           // </button>
