'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const UserTransformer = use('App/Transformers/UserTransformer')

/**
 * VisitantTransformer class
 *
 * @class VisitantTransformer
 * @constructor
 */
class VisitantTransformer extends BumblebeeTransformer {
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
     cpf: model.cpf,
     last_login: model.last_login
    }
  }

  includeUser (model) {
    return this.item(model.getRelated('user'), UserTransformer)
  }

}

module.exports = VisitantTransformer
