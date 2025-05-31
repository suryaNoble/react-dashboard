import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import React from "react";
import { Link, redirect } from "react-router";
import { loginWithGoogle } from "~/appwrite/auth";
import { account } from "~/appwrite/client";

export async function clientLoader() {
  try {
    const user = await account.get();
    if (user?.$id) return redirect("/");
  } catch (error) {
    console.log("User not logged in:", error);
    return null; // don't block rendering
  }
}

const SignIn = () => {
  return (
    <main className="auth">
      {/* in app.css we made an image into a css style so we can use it in style auth used as class here */}

      <section className="size-full glassmorphism flex-center px-6">
        <div className="sign-in-card">
          <header className="header">
            <Link to="/">
              <img
                src="/assets/icons/logo.svg"
                alt="logo"
                className="size-[30px]"
              />
            </Link>
            <h1 className=" p-28-bold text-dark-100 ">goTravel</h1>
          </header>
          <article>
            <h2 className="p-28=semibold text-dark-100 text-center">
              Start Your Travel Journey
            </h2>
            <p className="p-18-regular text-center text-gray-100 !leading-7">
              sign in to explore the world with us. <br />
              Welcome to goTravel, your gateway to unforgettable adventures!
            </p>
          </article>

          <ButtonComponent
            type="button"
            iconCss="e-search-icon"
            className="button-class !h-11 !w-full"
            onClick={loginWithGoogle}
          >
            <img
              src="/assets/icons/google.svg"
              alt="google icon"
              className="size-5"
            />
            <span className="p-18-semibold text-white">
              Sign in with Google
            </span>
          </ButtonComponent>
        </div>
      </section>
    </main>
  );
};
export default SignIn;
