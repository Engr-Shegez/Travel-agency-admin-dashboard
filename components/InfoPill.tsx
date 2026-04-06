import React from "react";

const InfoPill = ({ text, image }: InfoPillProps) => {
  const textStr = text ?? "";
  return (
    <figure className="info-pill">
      <img src={image} alt={String(textStr)} />

      <figcaption>{String(textStr)}</figcaption>
    </figure>
  );
};

export default InfoPill;
