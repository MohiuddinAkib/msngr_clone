// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import Cors from "cors"
import admin from "@config/admin"
import {NextApiRequest, NextApiResponse} from "next";

// Initializing the cors middleware
const cors = Cors({
    methods: ["GET", "HEAD"],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result)
            }

            return resolve(result)
        })
    })
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    await runMiddleware(req, res, cors)

    try {
        const token = req.headers.authorization as string || ""

        if (!token) {
            return res.status(403)
                .json({
                    msg: "Auth token missing",
                })
        }
        const decoded = await admin.auth().verifyIdToken(token)
        if (!decoded) {
            return res.status(401)
                .json({
                    msg: "Unauthenticated"
                })
        }
        res.status(200)
        return res.json({msg: "Authenticated"});
    } catch (error) {
        res.status(500)
        return res.json({error});
    }

    res.json({msg: "hello"})
};
