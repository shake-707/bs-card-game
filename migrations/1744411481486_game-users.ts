import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';


export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable('game_users', {
        id: 'id',
        game_id: {
            type: 'integer',
            references: 'games(id)',
        },
        user_id: {
            type: 'integer',
            references: 'users(id)',
        },
        turn_order: {
            type: 'integer',
            notNull: true,
        },
        cards_placed_down: {
            type: 'integer',
            notNull: true,
        },
        game_user_won: {
            type: 'bool',
            default: false
        }
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable('game_users');
}
