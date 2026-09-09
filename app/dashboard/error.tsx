'use client';
export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="dashboard-error">
      <b>Qard</b>
      <h1>Impossible de charger ton espace.</h1>
      <p>{error.message}</p>
      <button className="button" onClick={reset}>
        Réessayer
      </button>
    </div>
  );
}
