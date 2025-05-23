import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder) => {
  // Drop existing incorrect FK
  pgm.dropConstraint("game_cards", "game_cards_owner_id_fkey");

  // Add correct FK to game_users.id
  pgm.addConstraint("game_cards", "game_cards_owner_id_fkey", {
    foreignKeys: {
      columns: "owner_id",
      references: "game_users(id)",
      onDelete: "CASCADE",
    },
  });
};

export const down = (pgm: MigrationBuilder) => {
  // Revert to FK pointing to users.id
  pgm.dropConstraint("game_cards", "game_cards_owner_id_fkey");

  pgm.addConstraint("game_cards", "game_cards_owner_id_fkey", {
    foreignKeys: {
      columns: "owner_id",
      references: "users(id)",
      onDelete: "CASCADE",
    },
  });
};
