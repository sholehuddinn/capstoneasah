/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("credentials", {
    id: {
      type: "varchar(36)",
      primaryKey: true,
    },

    name: {
      type: "varchar(255)",
      unique: true,
      notNull: true,
    },

    credentials: {
      type: "varchar(255)",
      notNull: true,
    }
  })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("credentials");
};
