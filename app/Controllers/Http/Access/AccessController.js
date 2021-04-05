'use strict'

    const Access = use("App/Models/Access");
    const moment = use("moment");
    const sendEmail = use("./../../../helpers/sendEmail");
    const User = use("App/Models/User");
    
class AccessController {

    async initiateCheckin({request, response, auth}) {        
        const { email } = request.all();
        
        if (!auth.getUser()) {
            return response.status(400).json({
                message: "user not logged in"
            })
        }

        try {

            const user = await User.findBy("email", email);
            
            const access = await Access.query()
            .where("user_id", user.id)
            .where("is_active", true)
            .first()

            if (access) {
                return response.status(400).json({
                    message: "user already have an active access"
                })
            }
    
            if (!user){
                return response.status(404).json({
                    message: "user not found"
                })
            }
            
            const code = Math.random().toString(36).slice(5);
            
            Access.create({
                user_id: user.id,
                code,
                is_active: true,
                photo: user.photo
            });
            
            const userData = {
                id: user.id, 
                username: user.username, 
                email: user.email 
            }

            return response.status(200).json({userData});

        } catch (err) {
            return response.status(400).json({
                message: "error initiating checkin"
            })
        }
        
        

    } 


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

            if (!access) {
                return response.status(400).json({
                    message: "user has no active checkin"
                })
            }

            if (!user.email) {
                return response.status(400).json({
                    message: "email is required"
                })
            }
    
            const alphanumeric = Math.random().toString(36).slice(5);
            
            access.merge({
                alphanumeric,
                checkin: new Date(),
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
