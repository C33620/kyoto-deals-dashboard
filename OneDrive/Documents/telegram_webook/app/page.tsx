export default function HomePage() {
  return (
    <main style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1>Tidio Telegram Bridge</h1>
      <p>The project is running locally.</p>

      <div style={{ marginTop: "24px" }}>
        <h2>Planned flow</h2>
        <ol>
          <li>User fills form in Tidio.</li>
          <li>Tidio opens our notify endpoint.</li>
          <li>User is redirected to Telegram bot.</li>
          <li>Telegram bot stores chat_id and sends user data back.</li>
        </ol>
      </div>
    </main>
  );
}
