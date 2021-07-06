'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const UserTransformer = use('App/Transformers/UserTransformer')

/**
 * EmployeeTransformer class
 *
 * @class EmployeeTransformer
 * @constructor
 */
class EmployeeTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */

  static get defaultInclude () {
    return [
      'user'
    ]
  }

  transform (model) {
    return {
     id: model.id, 
     user_id: model.user_id,
     registration: model.registration,
     last_login: model.last_login
    }
  }

  includeUser (model) {
    return this.item(model.getRelated('user'), UserTransformer)
  }

}

module.exports = EmployeeTransformer
