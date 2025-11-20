/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const up = (pgm) => {
  pgm.createTable("question", {
    id: {
      type: "varchar(36)",
      primaryKey: true,
    },
    user_id: {
      type: "varchar(36)",
      notNull: true,
    },
    tutorial_id: {
      type: "varchar(36)",
      notNull: true, 
    },
    assessment: {
      type: "varchar(255)",
      notNull: true,
    },
    option_1: {
      type: "varchar(255)",
      notNull: true,
    },
    option_2: {
      type: "varchar(255)",
      notNull: true,
    },
    option_3: {
      type: "varchar(255)",
      notNull: true,
    },
    option_4: {
      type: "varchar(255)",
      notNull: true,
    },
    answer: {
      type: "varchar(1)",
      notNull: true,
    },
  });

  pgm.addConstraint("question", "fk_question_user", {
    foreignKeys: {
      columns: "user_id",
      references: "users(id)",
      onDelete: "CASCADE",
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const down = (pgm) => {
  pgm.dropTable("question");
};
