import db from "./connection";

export default async function addLobbyGameId(): Promise<void> {
  const SQL = `
    INSERT INTO public.games (id, host_id, player_count)
    VALUES (0, 0, 1)
    ON CONFLICT (id) DO NOTHING;
  `;

  try {
    await db.none(SQL);
    console.log("Lobby game ensured in database.");
  } catch (error) {
    console.error("Failed to insert lobby game:", error);
  }
}
