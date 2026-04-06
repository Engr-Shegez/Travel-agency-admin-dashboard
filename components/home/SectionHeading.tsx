import { cn } from "~/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
  className?: string;
}

const SectionHeading = ({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) => {
  return (
    <header
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "",
        className
      )}
    >
      <span className="home-eyebrow">{eyebrow}</span>
      <h2 className="home-section-title">{title}</h2>
      <p className="max-w-2xl text-base leading-7 text-gray-500 md:text-lg">
        {description}
      </p>
    </header>
  );
};

export default SectionHeading;
