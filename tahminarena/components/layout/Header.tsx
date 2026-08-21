type HeaderProps = {
  title?: string;
  showBackButton?: boolean;
};

export default function Header({
  title = "TahminArena",
  showBackButton = false,
}: HeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="app-header__left">
          {showBackButton && (
            <button
              type="button"
              className="app-header__back"
              onClick={() => window.history.back()}
              aria-label="Geri dön"
            >
              ←
            </button>
          )}

          <div>
            <h1 className="app-header__title">{title}</h1>
            <p className="app-header__subtitle">
              Sosyal futbol tahmin platformu
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}