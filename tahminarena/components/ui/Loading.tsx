type LoadingProps = {
  text?: string;
  size?: "small" | "medium" | "large";
};

export default function Loading({
  text = "Yükleniyor...",
  size = "medium",
}: LoadingProps) {
  return (
    <div
      className={`ui-loading ui-loading--${size}`}
      role="status"
      aria-live="polite"
    >
      <span className="ui-loading__spinner" aria-hidden="true" />
      <span className="ui-loading__text">{text}</span>
    </div>
  );
}