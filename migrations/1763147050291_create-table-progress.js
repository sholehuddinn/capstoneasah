/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
export const up = (pgm) => {
  pgm.createTable("progress", {
    id: {
      type: "varchar(36)",
      notNull: true,
      primaryKey: true,
    },
    user_id: {
      type: "varchar(36)",
      notNull: true,
    },

    "35363": { type: "boolean", default: false, notNull: true },
    "35368": { type: "boolean", default: false, notNull: true },
    "35373": { type: "boolean", default: false, notNull: true },
    "35378": { type: "boolean", default: false, notNull: true },
    "35383": { type: "boolean", default: false, notNull: true },
    "35398": { type: "boolean", default: false, notNull: true },
    "35403": { type: "boolean", default: false, notNull: true },
    "35793": { type: "boolean", default: false, notNull: true },
    "35408": { type: "boolean", default: false, notNull: true },
    "35428": { type: "boolean", default: false, notNull: true },
  });

  // FOREIGN KEY 
  pgm.addConstraint("progress", "fk_progress_user", {
    foreignKeys: {
      columns: "user_id",
      references: "users(id)",
      onDelete: "CASCADE",
    },
  });

  // INDEX untuk user_id
  pgm.createIndex("progress", "user_id", { name: "idx_progress_user_id" });
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
export const down = (pgm) => {
  pgm.dropIndex("progress", "user_id", { name: "idx_progress_user_id" });
  pgm.dropConstraint("progress", "fk_progress_user");
  pgm.dropTable("progress");
};
