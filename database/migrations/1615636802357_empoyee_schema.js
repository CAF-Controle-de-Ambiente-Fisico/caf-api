'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EmpoyeeSchema extends Schema {
  async up () {
    await this.db.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    this.create('empoyees', (table) => {
      table.uuid("id").primary().defaultTo(this.db.raw("uuid_generate_v4()"));
      table.string('registration', 30)
      table.uuid('user_id').references('id').inTable('users').notNullable();
      table.text('cpf').notNullable().unique()
      table.timestamp('last_login')
      table.timestamp('deleted_at')
      table.string('image_url')
      table.timestamps()
    })
  }

  down () {
    this.drop('empoyees')
  }
}

module.exports = EmpoyeeSchema
