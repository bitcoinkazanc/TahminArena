type AdSlotProps = {
  label?: string;
};

export default function AdSlot({
  label = "Reklam Alanı",
}: AdSlotProps) {
  return (
    <section
      className="ad-slot"
      aria-label="Reklam alanı"
    >
      <span>{label}</span>
    </section>
  );
}