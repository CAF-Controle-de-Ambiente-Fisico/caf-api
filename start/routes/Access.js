/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
    Route.post('/checkin', "AccessController.checkin") 
  })
  .prefix("v1")
  .namespace("Access")  