import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder) => {
  pgm.addColumns("games", {
    current_turn: {
      type: "integer",
      notNull: true,
      default: 0,
    },
    current_value_index: {
      type: "integer",
      notNull: true,
      default: 0,
    },
  });
};

export const down = (pgm: MigrationBuilder) => {
  pgm.dropColumns("games", ["current_turn", "current_value_index"]);
};
