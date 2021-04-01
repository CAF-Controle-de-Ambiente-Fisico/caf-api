/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
    Route.post('/employee', "EmployeeController.store")
    Route.get('/employee', "EmployeeController.show")
    Route.put('/employee', "EmployeeController.update")
    Route.delete('/employee', "EmployeeController.destroy")
    Route.post('/confirmation', "EmployeeController.passwordConfirmation")
  })
  .prefix("v1")
  .namespace("Employee")  