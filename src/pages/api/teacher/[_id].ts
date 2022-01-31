import User, { IUser } from '@models/User'
import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@utils/database'

type ErrorResponse = {
  error: string,
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<IUser | IUser[] | ErrorResponse>
): Promise<void> => {
  switch (req.method) {
    case 'GET':
      try {
        await dbConnect()

        const { _id } = req.query

        if (!_id) return res.status(400).json({ error: 'Missing body params' })

        const user: IUser = await User.findById(_id)

        if (!user)
          return res.status(400).json({ error: 'Teacher not found on DB' })

        res.status(200).json(user)
      } catch (err) {
        res.status(400).json({ error: 'Fail' })
      }
      break
    default:
      res.status(402).json({ error: 'Method not allowed' })
      break
  }
}
