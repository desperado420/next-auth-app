import {connect} from "@/dbConfig/dbConfig"
import User from "@/models/userModel" // @ stands for the base directory
import {NextRequest, NextResponse} from "next/server"
import bcryptjs from "bcryptjs"
import { sendEmail } from "@/helpers/mailer"

connect()

export async function POST(request:NextRequest) {
    try{
        const reqBody = await request.json()
        const {username, email, password} = reqBody

        //validation
        const user = await User.findOne({email})
        if(user){
            return NextResponse.json({
                error:"User already exists"},
                {status:400
            })
        }

        // hash the password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = await User.create({
            email,
            username,
            password:hashedPassword
        })

        // send the email
        await sendEmail({email, emailType:"VERIFY", userId:newUser._id})

        return NextResponse.json({
            message:"User created successfully",
            success:true,
            newUser
        })

    } catch(error:any){
        return NextResponse.json({
            error:error.message},{
            status:500
        })
    }
}