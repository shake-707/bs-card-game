import {  MigrationBuilder } from 'node-pg-migrate';



export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable('cards', {
        id: 'id',
        value: {
            type: 'integer',
            notNull: true,
        },
        suit: {
            type: 'text',
            notNull: true
        },

    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable('cards');
}
