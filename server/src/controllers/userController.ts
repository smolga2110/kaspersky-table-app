import { NextFunction, Request, Response} from "express";
import fs from "fs/promises";

export const getData = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const data = await fs.readFile("./src/data/db.json", "utf-8")
        return res.json(JSON.parse(data))
    }
    catch(err){
        next(err)
    }
}

export const addUser = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const data = await fs.readFile("./src/data/db.json", "utf-8")
        const body = req.body
        const list = JSON.parse(data)
        list.users.push(body)
        return res.json(list)
    }
    catch(err){
        next(err)
    }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const data = await fs.readFile("./src/data/db.json", "utf-8")
        const id = parseInt(req.params.id as string)
        let list = JSON.parse(data)
        list = list.users.filter(el => el.id !== id)
    } 
    catch(err){
        next(err)
    }
}
