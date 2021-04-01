'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class HashSchema extends Schema {
  async up () {
    await this.db.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    this.create('hashes', (table) => {
      table.uuid('id').primary().defaultTo(this.db.raw("uuid_generate_v4()"))
      table.string('confirmation_token', 8).notNullable().unique()
      table.uuid('user_id').references('id').inTable('users').notNullable();
      table.timestamps()
    })
  }

  down () {
    this.drop('hashes')
  }
}

module.exports = HashSchema
