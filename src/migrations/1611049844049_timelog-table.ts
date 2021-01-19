/* eslint-disable camelcase */

import { MigrationBuilder } from "node-pg-migrate";

exports.shorthands = undefined;

exports.up = (pgm: MigrationBuilder) => {
  pgm.createTable('time_logs', {
    id: 'id',
    user_id: {
      type: 'integer',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE'
    },
    description: { type: 'varchar(200)', notNull: true },
    start_time: { type: 'timestamp', notNull: true },
    end_time: { type: 'timestamp' },
  })
};

exports.down = (pgm: MigrationBuilder) => {
  pgm.dropTable('time_logs')
};
