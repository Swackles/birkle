/* eslint-disable camelcase */

import { MigrationBuilder } from "node-pg-migrate";

exports.shorthands = undefined;

exports.up = (pgm: MigrationBuilder) => {
  pgm.createTable('timeLogs', {
    id: 'id',
    userId: {
      type: 'integer',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE'
    },
    description: { type: 'varchar(200)', notNull: true },
    startTime: { type: 'timestamp', notNull: true },
    endTime: { type: 'timestamp' },
  })
};

exports.down = (pgm: MigrationBuilder) => {
  pgm.dropTable('timeLogs')
};
