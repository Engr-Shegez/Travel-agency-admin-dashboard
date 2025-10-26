import { Link, useLocation } from "react-router-dom";
import {
  ChipsDirective,
  ChipListComponent,
  ChipDirective,
} from "@syncfusion/ej2-react-buttons";
import { cn, getFirstWord } from "~/lib/utils";

const chipColors = [
  "!bg-pink-50 !text-pink-500",
  "!bg-blue-50 !text-blue-500",
  "!bg-yellow-50 !text-yellow-600",
  "!bg-success-50 !text-success-700",
];

interface TripCardProps {
  id: string;
  name: string;
  location: string | Record<string, any>;
  imageUrl: string;
  tags?: string[];
  price?: string | number;
}

const TripCard = ({
  id,
  name,
  location,
  imageUrl,
  tags,
  price,
}: TripCardProps) => {
  const path = useLocation();

  // location can sometimes be an object (from parsed trip JSON) or a string.
  // Coerce to a friendly string for display.
  const locationText = (() => {
    if (typeof location === "string") return location;
    if (location && typeof location === "object") {
      // prefer city if available in the object
      if ("city" in location && (location as any).city)
        return (location as any).city;
      return JSON.stringify(location);
    }
    return "";
  })();

  const priceText = price ? String(price) : "";

  return (
    <Link
      to={
        path.pathname === "/" || path.pathname.startsWith("/travel")
          ? `/travel/${id}`
          : `/admin/trips/${id}`
      }
      className="trip-card"
    >
      <img src={imageUrl} alt={name} loading="lazy" />

      <article className="p-4">
        <h2>{name || "Untitled Trip"}</h2>
        <figure>
          <img
            src="/assets/icons/location-mark.svg"
            alt="location"
            className="size-4"
          />
          <figcaption>{locationText || "Unknown location"}</figcaption>
        </figure>
      </article>

      {Array.isArray(tags) && tags.length > 0 && (
        <div className="mt-5 pl-[18px] pr-3.5 pb-5">
          <ChipListComponent id="travel-chip">
            <ChipsDirective>
              {tags.filter(Boolean).map((tag, index) => (
                <ChipDirective
                  key={index}
                  text={getFirstWord(String(tag))}
                  cssClass={cn(chipColors[index % chipColors.length])}
                />
              ))}
            </ChipsDirective>
          </ChipListComponent>
        </div>
      )}
      {priceText ? (
        <article className="tripCard-pill">{priceText}</article>
      ) : null}
    </Link>
  );
};

export default TripCard;
