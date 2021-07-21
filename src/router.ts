import { Response, Request, Router } from "express"
import { Readable } from "stream"
import readline from "readline"

import multer from "multer"
import { client } from "./database/client"

const multerConfig = multer()

const router = Router()

router.post("/products", multerConfig.single("file"), async (request: Request, response: Response) => {
    const { file } = request

    const readableFile = new Readable();
    readableFile.push(file?.buffer)
    readableFile.push(null)

    const productsLine = readline.createInterface({
        input: readableFile
    });

    for await (let line of productsLine) {
        const productLineSplit = line.split(",")
        
        await client.products.create({
            data: {
                code_br: productLineSplit[0],
                description: productLineSplit[1],
                price: Number(productLineSplit[2]),
                quantity: Number(productLineSplit[3])
            }
        })
    }

    return response.send("It's done!")
})

export { router }