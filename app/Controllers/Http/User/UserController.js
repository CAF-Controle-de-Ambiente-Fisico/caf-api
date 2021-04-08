'use strict'

const User = use("App/Models/User")

class UserController {

    async show({request, response}){
        const { email } = request.get();

        if (!email) {
            return response.status(400).json({
                message: "email is required"
            })
        }

        try {

            const user = User.findBy("email", email);

            if (!user) {
                return response.status(400).json({
                    message: "user not found"
                })
            }

            return response.status(200).json({ user });

        } catch (err) {

            return response.status(400).json({
                message: "error getting user"
            })

        }


    }

}

module.exports = UserController
