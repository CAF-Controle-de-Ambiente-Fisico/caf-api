/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
    Route.post('/visitant', "VisitantController.store")
    Route.get('/visitant', "VisitantController.show")
    Route.put('/visitant', "VisitantController.update")
    Route.delete('/visitant', "VisitantController.destroy")
    Route.post('/visitant/confirmation', "VisitantController.passwordConfirmation")
  })
  .prefix("v1")
  .namespace("Visitant")  