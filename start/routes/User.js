/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
    Route.get('/user', "UserController.show")
  })
  .prefix("v1")
  .namespace("User")  