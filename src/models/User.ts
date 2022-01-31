import { Schema, model, models, Date } from 'mongoose'

export interface Appointments {
  date: Date
  teacher_name: string
  teacher_id: string
  student_id: string
  student_name: string
  course: string
  location: string
  appointment_link: string
}

export interface Reviews {
  student_name: string
  student_id: string
  review: number
  course: string
  date: Date
  location: string
}

export interface IUser {
  name: string
  email: string
  cellphone: string
  teacher: boolean
  coins: number
  courses: string[]
  availale_hours: {
    sunday?: number[]
    monday?: number[]
    tuesday?: number[]
    wednesday?: number[]
    thursday?: number[]
    friday?: number[]
    saturday?: number[]
  }
  availale_locations: string[]
  appointments: Appointments[]
  reviews: Reviews[]
}

const UserSchema = new Schema<IUser>({
    name: {type: String, required: true},
    email: {type: String, required: true},
    cellphone: {type: String, required: true},
    teacher: {type: Boolean, required: true},
    coins: {type: Number, required: true},
    courses: [{type: String, required: true}],
    availale_hours: {
      sunday: [{type: Number, required: false}],
      monday: [{type: Number, required: false}],
      tuesday: [{type: Number, required: false}],
      wednesday: [{type: Number, required: false}],
      thursday: [{type: Number, required: false}],
      friday: [{type: Number, required: false}],
      saturday: [{type: Number, required: false}],
    },
    availale_locations: [{type: String, required: true}],
    appointments: [{
        date: [{type: Date, required: true}],
        teacher_name: {type: String, required: true},
        teacher_id: {type: String, required: true},
        student_name: {type: String, required: true},
        student_id: {type: String, required: true},
        course: {type: String, required: true},
        location: {type: String, required: true},
        appointment_link: {type: String, required: true},
    }], 
    reviews: [{
        student_name: {type: String, required: true},
        student_id: {type: String, required: true},
        review: {type: Number, required: true},
        course: {type: String, required: true},
        date: {type: Date, required: true},
        location: {type: String, required: true},
    }],
})

export default models.User || model<IUser>('User', UserSchema)
