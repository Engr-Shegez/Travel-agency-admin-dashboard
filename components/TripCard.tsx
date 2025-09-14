import { Link, useLocation } from "react-router";
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

const TripCard = ({
  id,
  name,
  location,
  imageUrl,
  tags,
  price,
}: TripCardProps) => {
  const path = useLocation();

  return (
    <Link
      to={
        path.pathname === "/" || path.pathname.startsWith("/travel")
          ? `/travel/${id}`
          : `/trips/${id}`
      }
      className="trip-card"
    >
      <img src={imageUrl} alt={name} />

      <article>
        <h2>{name}</h2>
        <figure>
          <img
            src="/assets/icons/location-mark.svg"
            alt="location"
            className="size-4"
          />
          <figcaption>{location}</figcaption>
        </figure>
      </article>

      <div className="mt-5 pl-[18px] pr-3.5 pb-5">
        <ChipListComponent id="travel-chip">
          <ChipsDirective>
            {tags.map((tag, index) => (
              <ChipDirective
                key={index}
                text={getFirstWord(tag)}
                cssClass={cn(chipColors[index % chipColors.length])}
              />
            ))}
          </ChipsDirective>
        </ChipListComponent>
      </div>

      <article className="tripCard-pill">{price}</article>
    </Link>
  );
};

export default TripCard;
