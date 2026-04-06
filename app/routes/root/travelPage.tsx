import { Link } from "react-router";
import DestinationCard from "components/home/DestinationCard";
import ExperienceCard from "components/home/ExperienceCard";
import HeroSearch from "components/home/HeroSearch";
import SectionHeading from "components/home/SectionHeading";
import TestimonialCard from "components/home/TestimonialCard";
import {
  curationPillars,
  destinationCollections,
  featuredExperiences,
  heroMetrics,
  plannerTimeline,
  proofPoints,
  testimonials,
  travelStyleStories,
} from "~/constants/homepage";

const TravelPage = () => {
  return (
    <main className="home-main">
      <section className="home-hero">
        <div className="wrapper home-hero-grid">
          <div className="space-y-8 py-12 lg:py-20">
            <div className="space-y-5">
              <span className="home-eyebrow">Concierge travel planning, rethought</span>
              <h1 className="home-hero-title">
                Trips that feel cinematic before you even leave home.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-dark-400 md:text-xl">
                TripNest turns scattered inspiration into a polished route with the
                calm, precision, and taste of a travel advisor built into the product.
              </p>
            </div>

            <HeroSearch />

            <div className="grid gap-4 sm:grid-cols-3">
              {heroMetrics.map((metric) => (
                <article key={metric.label} className="home-metric-card">
                  <h2>{metric.value}</h2>
                  <p>{metric.label}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="relative py-12 lg:py-20">
            <div className="home-hero-visual">
              <img
                src="/assets/images/hero-img.png"
                alt="Curated luxury travel preview"
                className="h-full w-full object-cover"
              />
              <div className="home-card-overlay" />

              <div className="home-floating-note left-5 top-5">
                <span className="home-glass-pill">Curator pick</span>
                <p>Four-city route with island recovery days built in.</p>
              </div>

              <div className="home-floating-note bottom-6 right-5 max-w-[250px]">
                <span className="home-glass-pill">This week's most requested</span>
                <p>South Africa, Japan, and the Mediterranean for October departures.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-8 wrapper">
        <div className="home-proof-band">
          {proofPoints.map((point) => (
            <p key={point}>{point}</p>
          ))}
        </div>
      </section>

      <section id="destinations" className="home-section">
        <div className="wrapper space-y-12">
          <SectionHeading
            eyebrow="Destination-first discovery"
            title="Start with the feeling you want, then let the route follow."
            description="Instead of pushing generic packages, the homepage opens with regions and travel styles that speak to pace, energy, and taste."
          />

          <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
            <div className="grid gap-6 md:grid-cols-2">
              {destinationCollections.map((destination, index) => (
                <div
                  key={destination.title}
                  className={index === 0 ? "md:col-span-2" : ""}
                >
                  <DestinationCard {...destination} />
                </div>
              ))}
            </div>

            <aside className="home-story-panel">
              <div className="space-y-4">
                <span className="home-eyebrow">Travel styles</span>
                <h3 className="text-[28px] font-semibold leading-tight text-dark-100">
                  Luxury, adventure, solo, family. Same polish, different rhythm.
                </h3>
              </div>

              <div className="space-y-3">
                {travelStyleStories.map((style) => (
                  <article key={style.name} className="home-style-card">
                    <h4>{style.name}</h4>
                    <p>{style.summary}</p>
                  </article>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section id="experiences" className="home-section home-section-soft">
        <div className="wrapper space-y-12">
          <SectionHeading
            eyebrow="Featured experiences"
            title="Premium itineraries designed to feel expensive in the right ways."
            description="Each concept leads with atmosphere, pacing, and memorable moments rather than a checklist of inclusions."
          />

          <div className="grid gap-6 xl:grid-cols-3">
            {featuredExperiences.map((experience) => (
              <ExperienceCard key={experience.title} {...experience} />
            ))}
          </div>
        </div>
      </section>

      <section id="why-us" className="home-section">
        <div className="wrapper grid gap-8 xl:grid-cols-[1.05fr_1fr]">
          <div className="home-editorial-block">
            <span className="home-eyebrow">Why travelers choose TripNest</span>
            <h2 className="home-section-title">
              Because a great trip is really a thousand small decisions made well.
            </h2>
            <p className="text-lg leading-8 text-gray-500">
              Most travel tools dump options on the user. This homepage frames TripNest
              as the opposite: an opinionated planning partner that reduces friction
              while preserving taste.
            </p>

            <div className="grid gap-4 pt-4 sm:grid-cols-3">
              <article className="home-kpi-tile">
                <strong>18 min</strong>
                <span>to brief your trip idea</span>
              </article>
              <article className="home-kpi-tile">
                <strong>1 app</strong>
                <span>for route, mood, and logistics</span>
              </article>
              <article className="home-kpi-tile">
                <strong>Zero guesswork</strong>
                <span>on what to do next</span>
              </article>
            </div>
          </div>

          <div className="grid gap-5">
            {curationPillars.map((pillar) => (
              <article key={pillar.title} className="home-narrative-card">
                <h3>{pillar.title}</h3>
                <p>{pillar.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="planner" className="home-section home-section-dark">
        <div className="wrapper grid gap-10 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="xl:sticky xl:top-28 xl:self-start">
            <SectionHeading
              eyebrow="Interactive trip builder preview"
              title="See how a trip comes together before you commit."
              description="This section borrows the dashboard's clarity and turns it into a customer-facing planner preview with a stronger emotional payoff."
              className="mb-8"
            />

            <div className="home-planner-preview">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-primary-500">
                    Spring escape
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-dark-100">
                    Cape Town to Franschhoek
                  </h3>
                </div>
                <span className="rounded-full bg-success-50 px-3 py-1 text-sm font-medium text-success-700">
                  Ready to refine
                </span>
              </div>

              <div className="space-y-4 border-y border-light-400 py-6">
                {plannerTimeline.map((item) => (
                  <div key={item.day} className="flex items-start gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary-500">
                      {item.day.slice(-2)}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-semibold text-dark-100">
                        {item.title}
                      </h4>
                      <p className="text-sm leading-6 text-gray-500">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Estimated trip investment</p>
                  <strong className="text-2xl font-semibold text-dark-100">
                    $4,200 - $5,100
                  </strong>
                </div>
                <Link to="/sign-in" className="home-primary-button px-5 py-3">
                  Build this route
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {plannerTimeline.map((item) => (
              <article key={item.day} className="home-timeline-card">
                <span>{item.day}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <div className="home-timeline-detail">{item.detail}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="stories" className="home-section">
        <div className="wrapper space-y-12">
          <SectionHeading
            eyebrow="Traveler stories"
            title="Proof that premium can still feel deeply personal."
            description="The testimonials are written like reflections from real trips, not corporate endorsements, so the page keeps its editorial tone."
          />

          <div className="grid gap-6 xl:grid-cols-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.name} {...testimonial} />
            ))}
          </div>

          <div className="home-editorial-banner">
            <div className="space-y-3">
              <span className="home-eyebrow">What the best trips have in common</span>
              <h3 className="text-[30px] font-semibold leading-tight text-dark-100">
                They don't feel packed. They feel inevitable.
              </h3>
            </div>
            <p className="max-w-2xl text-base leading-7 text-gray-500 md:text-lg">
              Great planning removes the awkward edges, creates the right amount of
              anticipation, and leaves just enough room for the trip to surprise you.
            </p>
          </div>
        </div>
      </section>

      <section className="home-section pt-0">
        <div className="wrapper">
          <div className="home-final-cta">
            <div className="space-y-5">
              <span className="home-eyebrow border-white/15 bg-white/10 text-white/80">
                Ready when you are
              </span>
              <h2 className="max-w-3xl text-4xl font-semibold leading-tight text-white md:text-6xl">
                Plan a trip that looks beautiful on screen and feels even better in
                real life.
              </h2>
              <p className="max-w-2xl text-base leading-7 text-white/75 md:text-lg">
                Start with a destination, a feeling, or a rough travel window. TripNest
                turns it into a route worth booking.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/sign-in" className="home-primary-button bg-white !text-dark-100">
                Start planning
              </Link>
              <Link to="/dashboard" className="home-ghost-button border-white/20 text-white">
                Open dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TravelPage;
