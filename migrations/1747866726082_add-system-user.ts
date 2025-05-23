import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder) => {
  pgm.sql(`
    INSERT INTO users (
      id, first_name, last_name, email, password, user_name, gravatar, created_at, update_at
    )
    VALUES (
      0,
      'System',
      'User',
      'system@game.local',
      'not_applicable',
      'MiddlePile',
      '',
      NOW(),
      NOW()
    )
    ON CONFLICT DO NOTHING;
  `);
};

export const down = (pgm: MigrationBuilder) => {
  pgm.sql(`DELETE FROM users WHERE id = 0;`);
};
