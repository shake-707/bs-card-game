import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder) => {
  pgm.dropColumn("game_cards", "play_order");
};

export const down = (pgm: MigrationBuilder) => {
  pgm.addColumn("game_cards", {
    play_order: {
      type: "integer",
    },
  });
};

