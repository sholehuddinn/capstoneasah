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
    question_number: {
      type: "integer",
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

  // Tidak boleh duplikasi nomor soal per user
  pgm.addConstraint("question", "unique_user_question_num", {
    unique: ["user_id", "question_number"],
  });

  //  Index untuk query cepat berdasarkan user_id + question_number
  pgm.createIndex("question", ["user_id", "question_number"], {
    name: "idx_question_userid_questionnum"
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const down = (pgm) => {
  pgm.dropIndex("question", ["user_id", "question_number"], {
    name: "idx_question_userid_questionnum"
  });
  pgm.dropConstraint("question", "unique_user_question_num");
  pgm.dropTable("question");
};
