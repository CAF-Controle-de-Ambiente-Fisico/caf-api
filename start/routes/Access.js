/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
    Route.post('/checkin', "AccessController.checkin") 
    Route.post('/initiatecheckin', "AccessController.initiateCheckin") 
  })
  .prefix("v1")
  .namespace("Access")  