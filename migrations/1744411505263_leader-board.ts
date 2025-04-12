import { MigrationBuilder } from 'node-pg-migrate';



export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable('leader_board', {
        id: 'id',
        user_id: {
            type: 'integer',
            references: 'users(id)'
        },
        games_played: {
            type: 'integer',
            notNull: true,
        },
        games_won: {
            type: 'integer',
            notNull: true,
        }
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable('leader_board');
}
