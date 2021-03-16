'use strict'

class AuthController {

    async auth({request, response, auth}) {
        const {email, password} = request.all();
        if (!email || !password) {
            return response.status(400).json({
                message: (!email) ? "Email is required" : "password is required"
            })
        }
        try {

            const token = await auth.attempt(email, password);

            return response.status(200).json({
                message: "user logged",
                token
            })

        } catch (err) {
            return response.status(404).json({
                message: "error during login"
            })
        }
    }

}

module.exports = AuthController
