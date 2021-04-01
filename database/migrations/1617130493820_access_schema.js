'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AccessSchema extends Schema {
  async up () {
    await this.db.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    this.create('accesses', (table) => {
      table.uuid('id').primary().defaultTo(this.db.raw("uuid_generate_v4()"))
      table.uuid('user_id').references('id').inTable('users').notNullable();
      table.string('alphanumeric', 8).unique()
      table.string('code',8).notNullable().unique()
      table.timestamp('checkin')
      table.timestamp('checkout')
      table.timestamp('deleted_at')
      table.boolean('is_active').defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('accesses')
  }
}

module.exports = AccessSchema
