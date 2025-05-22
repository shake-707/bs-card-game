import { MigrationBuilder } from 'node-pg-migrate';

export const up = (pgm: MigrationBuilder) => {
  pgm.addColumn('games', {
    game_has_ended: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
  });
};

export const down = (pgm: MigrationBuilder) => {
  pgm.dropColumn('games', 'game_has_ended');
};

