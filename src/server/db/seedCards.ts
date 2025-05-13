// src/server/db/seedCards.ts
import db from "./connection";

export default async function seedCards() {
  const { count } = await db.one<{ count: number }>(
    `SELECT COUNT(*)::int AS count FROM cards`
  );
  if (count === 0) {
    const suits = ["hearts", "diamonds", "clubs", "spades"];
    const inserts: Promise<any>[] = [];
    for (const suit of suits) {
      for (let value = 1; value <= 13; value++) {
        inserts.push(
          db.none(`INSERT INTO cards (value, suit) VALUES ($1, $2)`, [
            value,
            suit,
          ])
        );
      }
    }
    await Promise.all(inserts);
    console.log("Master deck seeded");
  }
}
