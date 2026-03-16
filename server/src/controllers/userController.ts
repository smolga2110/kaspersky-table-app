import { NextFunction, Request, Response} from "express";
import fs from "fs/promises";
import { ApiResponse, User } from "../types";

export const getData = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const data = await fs.readFile("./src/data/db.json", "utf-8")

        const response: ApiResponse<User[]> = {
            success: true,
            data: JSON.parse(data)
        }
        
        return res.json(response)
    }
    catch(err){
        next(err)
    }
}

export const addUser = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const data = await fs.readFile("./src/data/db.json", "utf-8")
        const result = JSON.parse(data)
        const { name, email, phone } = req.body

        if ( !name || !email || !phone ){
            return res.status(400).json({
                success: false,
                error: "Missing required fields: name, email, phone"
            })
        }

        const newUser: User = {
            id: crypto.randomUUID(),
            name: name,
            login: name.split(" ").join(""),
            email: email,
            group: req.body.group || "Unmanaged",
            phone: phone
        }

        result.users.push(newUser)

        const response: ApiResponse<User[]> = {
            success: true,
            data: result,
            message: "User created succesfully"
        }

        await fs.writeFile("./src/data/db.json", JSON.stringify(result, null, 2))
        
        return res.status(201).json(response)
    }
    catch(err){
        next(err)
    }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const data = await fs.readFile("./src/data/db.json", "utf-8")
        let result = JSON.parse(data)
        const id = req.params.id
        const userExists = result.users.find((user: User) => user.id === id)

        if (!userExists){
            res.status(404).json({
                success: false,
                error: "User not found"
            })
        }

        result.users = result.users.filter((user: User) => user.id !== id)

        const response: ApiResponse<User[]> = {
            success: true,
            data: result,
            message: "User deleted succesfully"
        }

        await fs.writeFile("./src/data/db.json", JSON.stringify(result, null, 2))
        
        return res.status(204).json(response)
    } 
    catch(err){
        next(err)
    }
}
