import {  MigrationBuilder } from 'node-pg-migrate';



export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable('messages', {
        id: 'id',
        game_id: {
            type: 'integer',
            references: 'games(id)',
            notNull: true,
        },
        user_id: {
            type: 'integer',
            references: 'users(id)',
            notNull: true,
        },
        message: {
            type: 'text',
            notNull: true,
        },
        sent_at: {
            type: "timestamp",
            notNull: true,
            default: pgm.func('now()'), // postgres func for curr timestamp
        },

    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable('messages');
}
