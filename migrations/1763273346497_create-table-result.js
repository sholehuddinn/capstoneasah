/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
export const up = (pgm) => {
  pgm.createTable("result", {
    id: {
      type: "varchar(36)",
      primaryKey: true,
    },
    user_id: {
      type: "varchar(36)",
      notNull: true,
      references: '"users"',
      onDelete: "CASCADE",
    },
    question_id: {
      type: "varchar(36)",
      notNull: true,
      references: '"question"',
      onDelete: "CASCADE",
    },
    answer: {
      type: "varchar(255)",
      notNull: true,
    },
    is_true: {
      type: "boolean",
      default: false,
      notNull: true,
    },
  });

  pgm.addConstraint("result", "fk_result_user", {
    foreignKeys: {
      columns: "user_id",
      references: '"users"(id)',
      onDelete: "CASCADE",
    },
  });

  pgm.addConstraint("result", "fk_result_question", {
    foreignKeys: {
      columns: "question_id",
      references: '"question"(id)',
      onDelete: "CASCADE",
    },
  });

  pgm.createIndex("result", ["user_id"]);
  pgm.createIndex("result", ["question_id"]);
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
export const down = (pgm) => {
  pgm.dropTable("result");
};
