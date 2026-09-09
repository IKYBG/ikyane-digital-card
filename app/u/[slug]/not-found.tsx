import Link from 'next/link';
export default function QardNotFound() {
  return (
    <main className="public-qard-error">
      <b>Qard</b>
      <h1>Cette Qard n’existe pas.</h1>
      <p>Vérifie l’adresse ou crée ta propre identité numérique.</p>
      <Link className="button" href="/signup">
        Créer ma Qard
      </Link>
    </main>
  );
}
