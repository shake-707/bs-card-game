import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable('games', {
        id: 'id',
        host_id: {
            type: 'integer',
            references: 'users(id)',
            onDelete: 'SET NULL',
        },
        player_count: {
            type: 'integer',
            notNull: true,
        },
        created_at: {
            type: "timestamp",
            notNull: true,
            default: pgm.func('now()'),
        },
        game_end: {
            type: "timestamp",
            notNull: true,
            default: pgm.func('now()'),
        },
        started: {
            type: 'boolean',
            notNull: true,
            default: false,
        },
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable('games');
}
