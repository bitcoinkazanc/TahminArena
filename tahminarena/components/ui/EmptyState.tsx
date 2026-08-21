type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: string;
};

export default function EmptyState({
  title,
  description,
  icon = "📭",
}: EmptyStateProps) {
  return (
    <div className="ui-empty-state">
      <div className="ui-empty-state__icon" aria-hidden="true">
        {icon}
      </div>

      <h2 className="ui-empty-state__title">{title}</h2>

      {description && (
        <p className="ui-empty-state__description">
          {description}
        </p>
      )}
    </div>
  );
}