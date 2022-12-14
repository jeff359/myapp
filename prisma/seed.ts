import { PrismaClient } from "@prisma/client"
import { artistsData } from "./songsData"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

const run = async() => {
await Promise.all(artistsData.map(async(artist) => {
    return prisma.artist.upsert({
        where: {name: artist.name},
        update: {},
        create: {
            name: artist.name,
            songs: {
                create: artist.songs.map(song => ({
                    name: song.name,
                    duration: song.duration,
                    url: song.url,
                }))
            }
        }
    })
})) 

const salt = bcrypt.genSalt()
const user = await prisma.user.upsert({
    where: {email: "user@test.com"},
    update: {},
    create: {
        email: "user@test.com",
        password: bcrypt.hashSync("password", salt),
    }
})
}

run()
.catch(e => {
    console.error(e)
    process.exit(1)
})
.finally(async()=>{
    await prisma.$disconnect()
})