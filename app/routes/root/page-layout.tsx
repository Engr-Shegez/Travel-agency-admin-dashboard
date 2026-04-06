import { Link, Outlet } from "react-router";
import { footerLinks } from "~/constants/homepage";

const navItems = [
  { label: "Destinations", href: "#destinations" },
  { label: "Experiences", href: "#experiences" },
  { label: "Stories", href: "#stories" },
];

const PageLayout = () => {
  return (
    <div className="home-shell">
      <header className="home-nav ">
        <div className="home-nav-inner">
          <Link to="/" className="home-brand">
            <img
              src="/assets/icons/logo.svg"
              alt="TripNest"
              className="size-9"
            />
            <div>
              <strong>TripNest</strong>
              <span>Curated travel planning</span>
            </div>
          </Link>

          <nav className="home-nav-links">
            {navItems.map((item) => (
              <a key={item.label} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="home-nav-actions">
            <Link to="/sign-in" className="home-shell-link">
              Sign in
            </Link>
            <Link to="/dashboard" className="home-shell-cta">
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <Outlet />

      <footer className="home-footer">
        <div className="home-footer-inner">
          <div className="space-y-3">
            <div className="home-brand">
              <img
                src="/assets/icons/logo.svg"
                alt="TripNest"
                className="size-9"
              />
              <div>
                <strong>TripNest</strong>
                <span>Luxury planning for modern travelers</span>
              </div>
            </div>
            <p className="max-w-md text-sm leading-6 text-gray-500">
              Built for travelers who want their trip to feel considered from
              the first click to the final transfer.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            {footerLinks.map((link) => (
              <a
                key={link}
                href="/"
                onClick={(event) => event.preventDefault()}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PageLayout;
