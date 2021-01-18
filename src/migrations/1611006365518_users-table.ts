/* eslint-disable camelcase */

import { MigrationBuilder } from "node-pg-migrate";

exports.shorthands = undefined;

exports.up = (pgm: MigrationBuilder) => {
  pgm.createTable('users', {
    id: 'id',
    firstname: { type: 'varchar(100)', notNull: true },
    surname: { type: 'varchar(100)', notNull: true },
    email: { type: 'varchar(100)', notNull: true },
    password: { type: 'varchar(100)', notNull: true },
    token: { type: 'varchar(100)', notNull: true }
  })
};

exports.down = (pgm: MigrationBuilder) => {
  pgm.dropTable('users')
};
