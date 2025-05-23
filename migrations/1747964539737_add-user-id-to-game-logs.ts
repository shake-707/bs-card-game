import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumn("game_logs", {
    user_id: {
      type: "integer",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.dropColumn("game_logs", "game_user_id");
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumn("game_logs", {
    game_user_id: {
      type: "integer",
      notNull: true,
      references: "game_users(id)",
      onDelete: "CASCADE",
    },
  });
  pgm.dropColumn("game_logs", "user_id");
}
