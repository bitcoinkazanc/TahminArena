type AvatarProps = {
  src?: string | null;
  alt?: string;
  name?: string | null;
  size?: "small" | "medium" | "large";
};

function getInitial(name?: string | null) {
  if (!name) {
    return "?";
  }

  return name.trim().charAt(0).toUpperCase();
}

export default function Avatar({
  src,
  alt = "Profil fotoğrafı",
  name,
  size = "medium",
}: AvatarProps) {
  const className = [
    "ui-avatar",
    `ui-avatar--${size}`,
  ].join(" ");

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={`${className} ui-avatar--placeholder`}
      aria-label={alt}
    >
      {getInitial(name)}
    </div>
  );
}