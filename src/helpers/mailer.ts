import nodemailer from "nodemailer"
import User from "@/models/userModel"
import bcryptjs from "bcryptjs"

export const sendEmail = async({email, emailType, userId}:any) => {
    try{
        const hashedToken = await bcryptjs.hash(userId.toString(), 10)
        
        if(emailType==="VERIFY") {
            await User.findByIdAndUpdate(userId,
                {
                    verifyToken:hashedToken,
                    verifyTokenExpiry:Date.now()+3600000
                }    
            )
        }
        else if(emailType==="RESET"){
            await User.findByIdAndUpdate(userId,
                {
                    resetPasswordToken:hashedToken,
                    resetPasswordTokenExpiry:Date.now()+3600000
                }    
            )
        }

        const  transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASS
            }
          });  

        const mailOptions = {
            from:"vinayvashishth43@gmail.com",
            to:email,
            subject:emailType==="VERIFY"?"Verify your account":"Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}"> Here </a> to ${emailType==="VERIFY"?"Verify your account":"Reset your password"} </p>`
        }

        const mailresponse = await transporter.sendMail(mailOptions)
    
    } catch(error:any) {
        throw new Error(error.message)
    }
}