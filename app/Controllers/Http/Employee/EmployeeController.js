"use strict";

const Hash = use("App/Models/Hash");
const sendEmail = use("./../../../helpers/sendEmail");
const Database = use("Database");
const User = use("App/Models/User");
const Access = use("App/Models/Access");

class EmployeeController {
  async store({ request, response }) {
    const { username, email, photo, registration } = request.all();

    const trx = await Database.beginTransaction();

    try {
      const user = await User.create(
        {
          username,
          email,
          registration,
          photo,
        },
        trx
      );

      const confirmation_token = Math.random().toString(36).slice(5);

      await Hash.create(
        {
          user_id: user.id,
          confirmation_token,
        },
        trx
      );

      await sendEmail({
        code: confirmation_token,
        email: user.email,
        username: user.username,
      });

      trx.commit();

      return response.status(200).json({ user });
    } catch (err) {
      trx.rollback();
      console.log(err);
      return response.status(400).json({
        message: "error creating employee",
      });
    }
  }

  async show({ params, request, response, view }) {
    try {
      const user = await User.findOrFail(params.id);

      return response.status(200).json(user);
    } catch (err) {
      return response.status(404).json({
        message: "error showing user",
      });
    }
  }

  async update({ params, request, response }) {
    const data = request.all();

    try {
      const user = await User.findOrFail(params.id);

      if (!user) {
        return response.status(404).json({
          message: "error updating user",
        });
      }

      user.merge(data);

      await user.save();

      return response.status(200).json({
        message: "user updated",
        user,
      });
    } catch (err) {
      console.error(err);

      return response.status(404).json({
        message: "error updating user",
      });
    }
  }

  async destroy({ params, request, response }) {
    try {
      const user = await User.findOrFail(params.id);

      if (!user) {
        return response.status(404).json({
          message: "user not found",
        });
      }

      user.merge({
        deleted_at: new Date(),
      });

      await user.save();

      return response.status(200).json({
        message: "user deleted",
      });
    } catch (err) {
      console.log(err);

      return response.status(400).json({
        message: "error deleting user",
      });
    }
  }

  async passwordConfirmation({ request, response }) {
    const { password, confirm_password, token } = request.all();

    const trx = await Database.beginTransaction()

    try {
      if (password != confirm_password) {
        return response.status(400).json({
          message: "password is different",
        });
      }

      const hash = await Hash.query()
        .where("confirmation_token", token)
        .first();

      const user = await User.findBy("id", hash.user_id);

      user.password = password;

      await user.save(trx);

      await hash.delete(trx);

      trx.commit()

      return response.status(200).json({
        message: "password confirmed",
      });
    } catch (err) {
      console.log(err);

      trx.rollback()

      return response.status(200).json({
        message: "error confirmating password",
      });
    }
  }
}

module.exports = EmployeeController;
