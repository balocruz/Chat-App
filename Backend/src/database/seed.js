import "dotenv/config"
import connectMongoDb from "./database.js"
//import User from "../models/user.model.js"
import Conversation from "../models/conversation.model.js"

const seedConvo = async () =>{
    try{
        await connectMongoDb()
        const convo = await Conversation.create({
            participants:["6ac15e9a539d1bcbf816b750","6ac1842e90cba76bb346222c"] //["6ab8632c141bedf59cf879a4","6ab863c70f18b59181780693"]
        })
        console.log("Convo created \n", convo)
        process.exit(0)
    } catch(err){
        console.error("Failed to create convo", err)
        process.exit(1)
    }
}
// const seedUsers = async () => {
//     try{
//         await connectMongoDb()

//         const users = await User.create([{
//             username:"allan",
//             email:"allan.test.com",
//             password:"12345"
//         },
//         {
//             username:"cynthia",
//             email:"cynthia.test.com",
//             password:"12345"
//         }
//     ])
//     console.log("Users created \n", users)
//     process.exit(0)
//     } catch (err){
//         console.error("Failed to create users", err)
//         process.exit(1)
//     }
// }

seedConvo()