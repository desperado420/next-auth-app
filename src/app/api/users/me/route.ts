import { getDataFromToken } from "@/helpers/getDataFromToken";

import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

// just an API route that fetches user data from the backend and shows it to the user

connect()

export async function GET(request:NextRequest) {
    try{
        const id = await getDataFromToken(request)
        const user = await User.findOne({_id:id}).select("-password")

        return NextResponse.json({
            message:"User found",
            data:user
        })

    } catch(error:any) {
        return NextResponse.json({error:error.message},{status:400})
    }
}