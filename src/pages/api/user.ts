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
    case 'POST':
      try {
        await dbConnect()

        const {
          name,
          email,
          cellphone,
          teacher,
          courses,
          availale_hours,
          availale_locations,
        } = req.body

        if (teacher) {
          if (
            !name ||
            !email ||
            !cellphone ||
            !courses ||
            !availale_hours ||
            !availale_locations
          )
            return res.status(400).json({ error: 'Missing body params' })
        } else if (!teacher) {
          if (!name || !email || !cellphone)
            return res.status(400).json({ error: 'Missing body params' })
        }

        const user = await User.create({
          name,
          email,
          cellphone,
          teacher,
          coins: 0,
          courses: courses || [],
          availale_hours: availale_hours || {},
          availale_locations: availale_locations || [],
          appointments: [],
          reviews: [],
        })
        res.status(201).json(user)
      } catch (error) {
        res.status(400).json({ error: 'Fail' })
      }
      break
    default:
      res.status(402).json({ error: 'Method not allowed' })
      break
  }
}
