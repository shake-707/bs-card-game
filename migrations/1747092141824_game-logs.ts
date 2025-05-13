import { MigrationBuilder } from 'node-pg-migrate';


export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable('game_logs', {
        id: 'id',
        game_id: {
            type: 'integer',
            notNull: true,
            references: 'games(id)',
            onDelete: 'CASCADE',
        },
        game_user_id: {
            type: 'integer',
            notNull: true,
            references: 'game_users(id)',
            onDelete: 'CASCADE',
        },
        action: {
            type: 'text',
            notNull: true,
        },
        cards_count: {
            type: 'integer',
            notNull: true,
        },
        expected_value: {
            type: 'integer',
            notNull: true,
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('now()'),
        },
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable('game_logs');
}
