import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder) => {
  pgm.addColumn("games", {
    started: {
      type: "boolean",
      notNull: true,
      default: false,
    },
  });
};

export const down = (pgm: MigrationBuilder) => {
  pgm.dropColumn("games", "started");
};
