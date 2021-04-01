'use strict'

const Hash = use("App/Models/Hash");
const sendEmail = use("./../../../helpers/sendEmail");
const Database = use("Database")
const User = use("App/Models/User")


class EmployeeController {

    async store ({ request, response }) {

        const { username, email, cpf, photo, registration } = request.all();
    
        const trx = await Database.beginTransaction();
    
        try {
    
          const user = await User.create({
            username,
            email,
            cpf, 
            photo, 
            registration
          }, trx);
    
          const confirmation_token = Math.random().toString(36).slice(5);
    
          const hash = await Hash.create({
            user_id: user.id,
            confirmation_token 
          }, trx)
    
          await sendEmail({code: confirmation_token, email: user.email, username: user.username})
    
          trx.commit();
    
          return response.status(200).json({user});
        
        } catch (err) {
          trx.rollback();
          console.log(err);
          return response.status(400).json({
            message: "error creating employee",
          });
        }
      }


      async show ({ params, request, response, view }) {

        try {
          const user = await User.findOrFail(params.id);
    
          return response.status(200).json(user);
        } catch (err) {
          return response.status(404).json({
            message: "error showing user",
          });
        }
    
      }

      async update ({ params, request, response }) {

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

      async destroy ({ params, request, response }) {

        try {
          const user = await User.findOrFail(params.id);
    
          if (!user) {
            return response.status(404).json({
              message: "user not found",
            });
          }
    
          user.merge({
            deleted_at: new Date()
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


      async passwordConfirmation({request, response}) {
        const  { password, confirm_password } = request.all()
        const { token } = request.get()
        try {
          
          if (password != confirm_password) {
            return response.status(400).json({
              message: "password is different"
            })
          }
      
          const hash = await Hash.query()
          .where("confirmation_token", token)
          .first(); 

          console.log("HASH",hash, hash.user_id)
      
          const user = await User.findBy("id", hash.user_id);
      
          user.password =  password; 
          
          await user.save();
          
          await hash.delete(); 
  
          return response.status(200).json({
            message: "password confirmed"
          })

        } catch (err) {

          console.log(err); 

          return response.status(200).json({
            message: "error confirmating password"
          })

        }
    
      }



}

module.exports = EmployeeController
