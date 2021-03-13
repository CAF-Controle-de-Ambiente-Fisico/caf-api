"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use("App/Models/User");

/**
 * Resourceful controller for interacting with users
 */
class UserController {
  /**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {}

  /**
   * Render a form to be used for creating a new user.
   * GET users/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const { username, email, password } = request.all();

    try {
      const user = await User.create({
        username,
        email,
        password,
      });

      return response.status(200).json({
        message: "user created",
        user,
      });
    } catch (err) {
      console.log(err);
      return response.status(400).json({
        message: "error creating user",
      });
    }
  }

  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
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

  /**
   * Render a form to update an existing user.
   * GET users/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
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

  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    try {
      const user = await User.findOrFail(params.id);

      if (!user) {
        return response.status(404).json({
          message: "user not found",
        });
      }

      await user.delete();

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
}

module.exports = UserController;
