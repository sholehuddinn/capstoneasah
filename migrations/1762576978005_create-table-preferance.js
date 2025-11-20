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
  pgm.createType('theme_type', ['light', 'dark']);
  pgm.createType('layout_type', ['boxed', 'fluid']);
  pgm.createType('font_type', ['sans', 'serif', 'mono']);
  pgm.createType('font_size_type', ['sm', 'md', 'lg', 'xl']);

  pgm.createTable('preference', {
    id: { type: 'varchar(36)', primaryKey: true },
    user_id: {
      type: 'varchar(36)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },

    theme: { type: 'theme_type', notNull: true, default: 'light' },
    layout_width: { type: 'layout_type', notNull: true, default: 'fluid' },
    font: { type: 'font_type', notNull: true, default: 'sans' },
    font_size: { type: 'font_size_type', notNull: true, default: 'md' },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('preference');
};
