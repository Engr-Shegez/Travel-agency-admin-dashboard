import { ButtonComponent } from "@syncfusion/ej2-react-buttons";

import { Link, redirect } from "react-router-dom";
import { loginWithGoogle } from "~/appwrite/auth";
import { account } from "~/appwrite/client";

export async function clientLoader() {
  try {
    const user = await account.get();
    // If the user is already authenticated, redirect to the app home
    if (user && user.$id) return redirect("/");
  } catch (e) {
    // Log the actual error for debugging (401 will indicate unauthenticated)
    console.error("Error fetching user:", e);
    // If there's an auth error (401) we want to allow the sign-in page to render,
    // so return null. Other errors are also swallowed here to avoid breaking the UI.
    return null;
  }

  return null;
}

const SignIn = () => {
  return (
    <main className="auth">
      <section className="size-full glassmorphism flex-center px-6">
        <div className="sign-in-card">
          <header className="header">
            <Link to="/">
              <img
                src="/assets/icons/logo.svg"
                alt="logo"
                className="size-{30px}"
              />
            </Link>
            <h1 className="p-28-bold text-dark-100">TripNest</h1>
          </header>

          <article>
            <h2 className="p-28-semibold text-dark-100 text-center">
              Begin Your Adventure
            </h2>

            <p className="p-188-regular text-center text-gray-100 !leading-7 ">
              Sign in with Google to easily manage your destinations,
              itineraries, and activities.
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
              className="size-5"
              alt="google"
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
