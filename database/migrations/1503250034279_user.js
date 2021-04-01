'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  async up () {
    await this.db.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    this.create('users', (table) => {
      table.uuid('id').primary().defaultTo(this.db.raw("uuid_generate_v4()"))
      table.string('username', 80).notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60)
      table.string('cpf', 11).unique() 
      table.text('photo') 
      table.string('registration',30).unique()
      table.timestamp('deleted_at')
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
