/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
    Route.post('/auth', "AuthController.auth") 
  })
  .prefix("v1")
  .namespace("Auth")  