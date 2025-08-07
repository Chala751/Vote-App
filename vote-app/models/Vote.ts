import mongoose from 'mongoose'

const VoteSchema = new mongoose.Schema({
  player: {
    type: String,
    enum: ['Ronaldo', 'Messi'],
    required: true,
  },
  ip: {
    type: String,
    required: true,
    unique: true, // Only one vote per IP
  },
}, { timestamps: true })

export default mongoose.models.Vote || mongoose.model('Vote', VoteSchema)
