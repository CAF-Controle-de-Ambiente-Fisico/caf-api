"use strict";

const Hash = use("App/Models/Hash");
const sendEmail = use("./../../../helpers/sendEmail");
const Database = use("Database");
const User = use("App/Models/User");
const Visitant = use("App/Models/Visitant");
const Access = use('App/Models/Access')

class VisitantController {

  async store({ request, response }) {
    const { username, email, photo, cpf } = request.all();

    const trx = await Database.beginTransaction();

    try {

      const user = await User.create({
          username,
          email,
          photo,
        }, trx);

      const visitant = await Visitant.create({ 
        user_id: user.id,
        cpf,
      }, trx); 

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
        role: 'visitant'
      });

      trx.commit();

      return response.status(200).json({ user, visitant });
    } catch (err) {
      trx.rollback();

      console.log(err);

      return response.status(400).json({
        message: "error creating visitant",
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
          message: "error updating visitant",
        });
      }

      user.merge(data);

      await user.save();

      return response.status(200).json({
        message: "visitant updated",
        user,
      });
    } catch (err) {
      console.error(err);

      return response.status(404).json({
        message: "error updating visitant",
      });
    }
  }

  async destroy({ params, request, response }) {

    const trx = Database.beginTransaction() 

    try {
      const visitant = await Visitant.findBy("user_id",params.id);

      if (!visitant) {
        return response.status(404).json({
          message: "user not found",
        });
      }

      visitant.merge({
        deleted_at: new Date(),
      }, trx);

      const user = await User.findOrFail(params.id);

      user.merge({
        deleted_at: new Date()
      }, trx);

      await visitant.save();

      await user.save();

      trx.commit(); 

      return response.status(200).json({
        message: "user deleted",
      });

    } catch (err) {
      console.log(err);

      trx.rollback();

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

      
      const code = Math.random().toString(36).slice(5);
      // let access = await Access.findBy('code', code)
      
      // while(!access) {
      //   code = Math.random().toString(36).slice(5);
      //   access = await Access.findBy('code', code)
      // }

      const access = await Access.create({
        user_id: user.id,
        code,
        is_active: true,
      }, trx);

      access.save();
      
      trx.commit()

      return response.status(200).json({
        message: "password confirmed",
      });
    } catch (err) {
      console.log(err);

      trx.rollback()

      return response.status(400).json({
        message: "error confirmating password",
      });
    }
  }
}

module.exports = VisitantController;
