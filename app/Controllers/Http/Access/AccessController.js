"use strict";

const Access = use("App/Models/Access");
const sendCodeAccess = use("./../../../helpers/sendCodeAccess");
const User = use("App/Models/User");
const Database = use("Database");

class AccessController {
  async checkin({ request, response }) {
    try {
      const { code, email } = request.all();

      // block usage case
      if (!email) {
        return response.status(400).json({
          message: "email is required",
        });
      }

      const user = await User.query().where("email", email).first();

      if (!user) {
        return response.status(400).json({
          message: "Usuário não cadastrado",
        });
      }

      if (!code) {
        return response.status(400).json({
          message: "access code is required",
        });
      }

      const access = await Access.query()
      .where("user_id", user.id)
      .where("code", code)
      .where("is_active", true)
      .whereNull("checkin")
      .first();

      if (!access) {
        return response.status(400).json({
          message: "user has no active checkin",
        });
      }
      // end block usage case

      access.merge({
        checkin: new Date(),
      });

      await access.save();

      return response.status(200).json(access);
    } catch (err) {
      console.log(err);
      return response.status(400).json({
        message: "checkin can't be done",
      });
    }
  }

  async checkout({ response, request }) {
    const trx = await Database.beginTransaction();

    try {
      const { code, email } = request.all();

      // block usage case
      if (!email) {
        return response.status(400).json({
          message: "email is required",
        });
      }

      const user = await User.query().where("email", email).first();

      if (!user) {
        return response.status(400).json({
          message: "Usuário não cadastrado",
        });
      }

      if (!code) {
        return response.status(400).json({
          message: "access code is required",
        });
      }

      const access = await Access.query()
        .where("user_id", user.id)
        .where("code", code)
        .where("is_active", true)
        .whereNotNull("checkin")
        .first();

      if (!access) {
        return response.status(400).json({
          message: "access not found",
        });
      }

      // const alphanumeric = Math.random().toString(36).slice(5);

      access.merge({
        checkout: new Date(),
        code: 0,
        is_active: false,
      });

      await access.save();

      const newCode = Math.random().toString(36).slice(5);
      // let access = await Access.findBy('code', code)

      // while(!access) {
      //   code = Math.random().toString(36).slice(5);
      //   access = await Access.findBy('code', code)
      // }

      const newAccess = await Access.create(
        {
          user_id: user.id,
          code: newCode,
          is_active: true,
        },
        trx
      );

      await sendCodeAccess({
        code,
        email: user.email,
        username: user.username,
        role: "employee",
      });

      // block usage case

      newAccess.save();

      trx.commit();

      return response.status(200).json(newAccess);
    } catch (err) {
      console.log(err);
      return response.status(400).json({
        message: "checkin can't be done",
      });
    }
  }
}
module.exports = AccessController;
