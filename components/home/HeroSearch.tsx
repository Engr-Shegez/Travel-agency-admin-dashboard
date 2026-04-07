import { useNavigate } from "react-router";

const HeroSearch = () => {
  const navigate = useNavigate();

  return (
    <div className="home-search-panel">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_auto] xl:items-end">
        <label className="home-search-field">
          <span>Destination</span>
          <input
            type="text"
            placeholder="Cape Town, Kyoto, Amalfi Coast"
            className="home-search-input"
          />
        </label>

        <label className="home-search-field">
          <span>Travel window</span>
          <input
            type="text"
            placeholder="October 2026"
            className="home-search-input"
          />
        </label>

        <label className="home-search-field">
          <span>Travelers</span>
          <select className="home-search-input">
            <option>2 adults</option>
            <option>Solo traveler</option>
            <option>Family of 4</option>
            <option>Friends getaway</option>
          </select>
        </label>

        <button
          type="button"
          onClick={() => navigate("/sign-in")}
          className="home-primary-button h-[58px] px-6"
        >
          Plan My Trip
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
        <span className="rounded-full bg-light-200 px-3 py-1.5 text-dark-100">
          No endless tabs
        </span>
        <span className="rounded-full bg-light-200 px-3 py-1.5 text-dark-100">
          Concierge pacing
        </span>
        <span>
          Start with your dream route and we shape the smartest version of it.
        </span>
      </div>
    </div>
  );
};

export default HeroSearch;
