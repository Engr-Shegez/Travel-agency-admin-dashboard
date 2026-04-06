interface ExperienceCardProps {
  title: string;
  location: string;
  description: string;
  image: string;
  duration: string;
  price: string;
}

const ExperienceCard = ({
  title,
  location,
  description,
  image,
  duration,
  price,
}: ExperienceCardProps) => {
  return (
    <article className="home-experience-card group">
      <div className="overflow-hidden rounded-[24px]">
        <img
          src={image}
          alt={title}
          className="h-[260px] w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          loading="lazy"
        />
      </div>

      <div className="space-y-5 p-6">
        <div className="flex items-center justify-between gap-3 text-sm text-gray-500">
          <span>{location}</span>
          <span>{duration}</span>
        </div>

        <div className="space-y-3">
          <h3 className="text-[24px] font-semibold leading-tight text-dark-100">
            {title}
          </h3>
          <p className="text-base leading-7 text-gray-500">{description}</p>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-light-400 pt-5">
          <span className="text-sm font-medium uppercase tracking-[0.24em] text-primary-500">
            {price}
          </span>
          <span className="text-sm font-medium text-dark-100 transition-transform duration-300 group-hover:translate-x-1">
            View concept
          </span>
        </div>
      </div>
    </article>
  );
};

export default ExperienceCard;
