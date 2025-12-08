/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const up = (pgm) => {
  pgm.createTable("respon_submodul", {
    id: "id",

    assessment_key: {
      type: "text",
      notNull: true,
      unique: true,
    },

    tutorial_key: {
      type: "text",
      notNull: false,
    },

    score: {
      type: "numeric(5,2)",
      notNull: true,
      default: "0",
    },

    benar: {
      type: "integer",
      notNull: true,
      default: 0,
    },

    total: {
      type: "integer",
      notNull: true,
      default: 0,
    },

    lama_mengerjakan: {
      type: "text",
      notNull: false,
    },

    feedback: {
      type: "jsonb",
      notNull: false,
    },

    user_id: {
      type: "integer",
      references: "users(id)",
      onDelete: "SET NULL",
    },

    created_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
    },

    updated_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const down = (pgm) => {
  pgm.dropTable("assessments");
};
