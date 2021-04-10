"use strict";

const User = use("App/Models/User");
const Access = use("App/Models/Access");

class AuthController {
  async auth({ request, response, auth }) {
    const { email, password } = request.all();
    if (!email || !password) {
      return response.status(400).json({
        message: !email ? "Email is required" : "password is required",
      });
    }
    try {
      const token = await auth.attempt(email, password);

      const user = await User.findBy("email", email);

      const access = await Access.query("user_id", user.id).where('is_active', true).first();

      return response.status(200).json({
        message: "user logged",
        token,
        user,
        access,
      });
    } catch (err) {
      return response.status(404).json({
        message: "error during login",
        error: err.code,
      });
    }
  }
}

module.exports = AuthController;
