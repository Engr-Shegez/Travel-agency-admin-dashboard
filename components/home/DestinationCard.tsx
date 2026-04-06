interface DestinationCardProps {
  title: string;
  region: string;
  description: string;
  image: string;
  highlight: string;
}

const DestinationCard = ({
  title,
  region,
  description,
  image,
  highlight,
}: DestinationCardProps) => {
  return (
    <article className="home-destination-card group">
      <img src={image} alt={title} className="home-card-image" loading="lazy" />
      <div className="home-card-overlay" />

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-center justify-between gap-3">
          <span className="home-glass-pill">{region}</span>
          <span className="home-glass-pill">Curated routes</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-white">{title}</h3>
            <p className="max-w-sm text-sm leading-6 text-white/80 md:text-base">
              {description}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-white/15 pt-4 text-sm text-white/80">
            <span>{highlight}</span>
            <span className="translate-x-0 transition-transform duration-300 group-hover:translate-x-1">
              Discover
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default DestinationCard;
