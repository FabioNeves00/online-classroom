import User, { IUser, Appointments } from '@models/User'
import dbConnect from '@utils/database'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'

type ErrorResponse = {
  error: string
}

export default withApiAuthRequired(
  async (
    req: NextApiRequest,
    res: NextApiResponse<IUser | IUser[] | ErrorResponse>
  ): Promise<void> => {
    switch (req.method) {
      case 'POST':
        try {
          const user = getSession(req, res)

          if (!user) {
            return res.status(401).json({ error: 'Unauthorized' })
          }

          await dbConnect()

          const {
            date,
            teacher_name,
            teacher_id,
            student_name,
            student_id,
            course,
            location,
            appointment_link,
          }: Appointments = req.body

          if (
            !date ||
            !teacher_name ||
            !teacher_id ||
            !student_name ||
            !student_id ||
            !course ||
            !location
          )
            return res.status(400).json({ error: 'Missing body params' })

          const teacher: IUser = await User.findById(teacher_id)
          const student: IUser = await User.findById(student_id)

          if (!teacher) {
            return res.status(400).json({ error: 'Teacher ID not found on DB' })
          }

          if (!student) {
            return res.status(400).json({ error: 'Student ID not found on DB' })
          }

          const appointment: Appointments = {
            date,
            teacher_id,
            teacher_name: teacher.name,
            student_id,
            student_name: student.name,
            course,
            location,
            appointment_link: appointment_link || '',
          }

          await User.findByIdAndUpdate(teacher_id, {
            $push: { appointments: appointment },
            $inc: { coins: 1 },
          })

          await User.findByIdAndUpdate(student_id, {
            $push: { appointments: appointment },
            $inc: { coins: -1 },
          })

          res.status(200).json([teacher, student])
        } catch (error) {
          console.log(error)

          res.status(400).json({ error: 'Fail' })
        }
        break
      default:
        res.status(402).json({ error: 'Method not allowed' })
        break
    }
  }
)
