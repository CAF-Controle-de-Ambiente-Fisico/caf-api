'use strict'

    const Access = use("App/Models/Access");
    const sendEmail = use("./../../../helpers/sendEmail");
    const User = use("App/Models/User");
    
class AccessController {

    async initiateCheckin({request, response}) {        
        const { email } = request.all();

        try {

            const user = await User.findBy("email", email);

            if (!user) {
                return response.status(404).json({
                    message: "user not found"
                })
            } 
            
            const access = await Access.query()
            .where("user_id", user.id)
            .where("is_active", true)
            .first()

            if (access) {
                return response.status(400).json({
                    message: "user already have an active access, please checkout"
                })
            }
    
            if (!user){
                return response.status(404).json({
                    message: "user not found"
                })
            }
            
            const userData = {
                username: user.username, 
                photo: user.photo
            }

            return response.status(200).json({userData, code});

        } catch (err) {
            return response.status(400).json({
                message: "error initiating checkin"
            })
        }
        
        

    } 


    async checkin({request, response}) {
        
        try {
            const { code } = request.all(); 
    
            if (!code) {
                return response.status(400).json({
                    message: "access code is required"
                })
            }

            const access = await Access.query()
            .where("user_id", user.id)
            .where("code", code)
            .where("is_active", false)
            .first()

            if (access) {
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

            return response.status(200).json({ access })
    
        } catch (err) {
            console.log(err)
            return response.status(400).json({
                message: "checkin can't be done"
            })
        }
    }
    
    async initiateCheckout({response, request}) {
        const { email } = request.all();

        try {

            const user = await User.findBy("email", email);

            if (!user) {
                return response.status(404).json({
                    message: "user not found"
                })
            } 
            
            const access = await Access.query()
            .where("user_id", user.id)
            .where("is_active", true)
            .whereNotNull("checkin")
            .first()

            if (!access) {
                return response.status(404).json({
                    message: "you need to have a checkin active to make a checkout!"
                })
            }

            const userData = {
                username: user.username, 
                photo: user.photo 
            }

            return response.status(200).json({ userData })

        } catch (err) {
            return response.status(400).json({
                message: "error initiating checkout"
            })
        }
    }
    
    async checkout({response, request}) {

        const { code } = request.all(); 
        
        try {

        if (!code) {
            return response.status(400).json({
                message: "access code is required"
            })
        }

        const access = Access.merge({
            checkout: new Date(),
            is_active: false 
        })

        await access.save()

        return response.status(200).json({
            message: "checkout done"
        })


        } catch (err) {

            return response.status(400).json({
                message: "checkout can't be done"
            })
            
        }

    }

}
    module.exports = AccessController
