import express, {Express, Request, Response} from "express";
import dotenv from 'dotenv'
import cors from 'cors';

import userRoutes from "./routes/userRoutes"

const app: Express = express()
const port = process.env.PORT || 3000

dotenv.config()

app.use(cors())
app.use(express.json())

app.use("/api/users", userRoutes)

// добавить error handler

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})