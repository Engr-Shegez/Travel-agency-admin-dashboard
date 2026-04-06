interface TestimonialCardProps {
  quote: string;
  name: string;
  context: string;
  image: string;
}

const TestimonialCard = ({
  quote,
  name,
  context,
  image,
}: TestimonialCardProps) => {
  return (
    <article className="home-testimonial-card">
      <p className="text-lg leading-8 text-dark-100">"{quote}"</p>

      <div className="flex items-center gap-4 pt-4">
        <img
          src={image}
          alt={name}
          className="size-14 rounded-full object-cover"
          loading="lazy"
        />
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-dark-100">{name}</h3>
          <p className="text-sm text-gray-500">{context}</p>
        </div>
      </div>
    </article>
  );
};

export default TestimonialCard;
