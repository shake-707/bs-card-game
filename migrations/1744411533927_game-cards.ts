import { MigrationBuilder } from 'node-pg-migrate';



export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable('game_cards',{
        id: 'id',
        game_id: {
            type: 'integer',
            references: 'games(id)',
        },
        card_id: {
            type: 'integer',
            references: 'cards(id)',
        },
        owner_id: {
            type: 'integer',
            references: 'users(id)'
        },
        play_order: {
            type: 'integer',
        }
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable('game_cards');
}
