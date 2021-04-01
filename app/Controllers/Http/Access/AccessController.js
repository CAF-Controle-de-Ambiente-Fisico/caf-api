'use strict'

    const Access = use("App/Models/Access");
    const moment = use("moment");
    const sendEmail = use("./../../../helpers/sendEmail");
class AccessController {

    async checkin({request, response, auth}) {
        
        try {
            const { code } = request.all(); 
    
            if (!code) {
                return response.status(400).json({
                    message: "access code is required"
                })
            }
    
            const user = await auth.getUser();

            const access = await Access.query()
            .where("user_id", user.id)
            .where("code", code)
            .where("is_active", true)
            .first()

            if (!user.email) {
                return response.status(400).json({
                    message: "email is required"
                })
            }
    
            const alphanumeric = Math.random().toString(36).slice(5);
            
            access.merge({
                user_id: user.id,
                alphanumeric,
                checkin: new Date(),
                is_active: true
            });
    
            await access.save();

            await sendEmail({ username: user.username, email: user.email, code: access.alphanumeric })

            return response.status(200).json({ access })
    
        } catch (err) {
            console.log(err)
            return response.status(400).json({
                message: "checkin can't be done"
            })
        }
    }
}

module.exports = AccessController
