/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const up = (pgm) => {
  pgm.createTable("question_explanations", {
    id: {
      type: "varchar(36)",
      primaryKey: true,
    },
    question_id: {
      type: "varchar(36)",
      notNull: true,
      unique: true, 
    },
    explanation_1: {
      type: "text",
      notNull: false,
    },
    explanation_2: {
      type: "text",
      notNull: false,
    },
    explanation_3: {
      type: "text",
      notNull: false,
    },
    explanation_4: {
      type: "text",
      notNull: false,
    },
    created_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.addConstraint(
    "question_explanations",
    "fk_question_explanations_question",
    {
      foreignKeys: {
        columns: "question_id",
        references: "question(id)",
        onDelete: "CASCADE",
      },
    }
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const down = (pgm) => {
  pgm.dropTable("question_explanations");
};
