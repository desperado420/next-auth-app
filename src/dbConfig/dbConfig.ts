import mongoose from 'mongoose'


export async function connect() {
    try{
        mongoose.connect(process.env.DB_URL!)
        const connection = mongoose.connection

        connection.on('connected', ()=>{
            console.log('MongoDB connected successfully')
        })
        
        connection.on('error', (error)=>{
            console.log('MongoDB Connection Failed')
            console.log("Here is the error", error)
            process.exit(1)
        })

    } catch(error){
        console.log("DB Connection Failed")
        console.log(error)
    }
}