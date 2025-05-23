import { MigrationBuilder } from "node-pg-migrate";



export const up = (pgm: MigrationBuilder) => {
  pgm.addColumn("game_users", {
    is_current: {
      type: "boolean",
      notNull: true,
      default: false,
    },
  });
};

export const down = (pgm: MigrationBuilder) => {
  pgm.dropColumn("game_users", "is_current");
};

