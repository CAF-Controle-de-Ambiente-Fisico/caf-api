/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.group(() => {
  Route.post("/checkin", "AccessController.checkin");
  Route.post("/checkout", "AccessController.checkout");
})
  .prefix("v1")
  .namespace("Access");
