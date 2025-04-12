import { MigrationBuilder } from 'node-pg-migrate';



export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("users", {
        id: 'id',
        created_at: {
            type: "timestamp",
            notNull: true,
            default: pgm.func('now()'), // postgres func for curr timestamp
        },
        first_name: {
            type: 'varchar(100)',
            notNull: true,
        },
        last_name: {
            type: 'varchar(100)',
            notNull: true,
        },
        email: {
            type: 'varchar(100)',
            notNull:true,
            unique: true,
        },
        password:{
            type: 'varchar(100)',
            notNull: true,
        },
        update_at: {
            type: "timestamp",
            notNull: true,
            default: pgm.func('now()'),
        },
        user_name: {
            type: 'varchar(100)',
            notNull: true,
        }
        
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable('users');
}
