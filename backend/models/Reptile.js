import mongoose, { Schema } from 'mongoose';

const reptileSchema = new Schema(
  {
    name: {
      type: String,
    },
    species: {
      type: String,
      required: true
    },
    morph: {
      type: String
    }, sex: {
      type: String,
      enum: ['M', 'F', 'Unknown'],
      required: true,
    },
    isBreeder: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
    },
    image: {
      type: String
    },
    birthDate: {
      type: Date
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    collection: "Reptile",
    timestamps: true
  }
)

const Reptile = mongoose.models.Reptile || mongoose.model("Reptile", reptileSchema)
export default Reptile