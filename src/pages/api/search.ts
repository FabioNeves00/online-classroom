import User, { IUser } from '@models/User'
import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@utils/database'

type ErrorResponse = {
  error: string
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<IUser | IUser[] | ErrorResponse>
): Promise<void> => {
  switch (req.method) {
    case 'GET':
      try {
        await dbConnect()

        const { courses } = req.body

        if (!courses)
          return res.status(400).json({ error: 'Missing body params' })

        const users: IUser[] = await User.find({courses: {$in: [new RegExp(`^${courses}`, `i`)]}})

        if (users.length === 0)
          return res.status(400).json({ error: 'Course not found' })

        res.status(200).json(users)
      } catch (error) {
          console.log(error);
          
        res.status(400).json({ error: 'Fail' })
      }
      break
    default:
      res.status(402).json({ error: 'Method not allowed' })
      break
  }
}
