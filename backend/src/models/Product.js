import mongoose from 'mongoose'

const specsSchema = new mongoose.Schema(
  {
    case: { type: String, required: true },
    movement: { type: String, required: true },
    crystal: { type: String, required: true },
    waterResistance: { type: String, required: true },
  },
  { _id: false }
)

const productSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ['Dress', 'Diver', 'Pilot', 'Chronograph', 'Sport'],
    },
    featured: { type: Boolean, default: false },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    specs: { type: specsSchema, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret.productId
        delete ret.productId
        delete ret._id
        delete ret.__v
        delete ret.createdAt
        delete ret.updatedAt
        return ret
      },
    },
  }
)

export default mongoose.models.Product || mongoose.model('Product', productSchema)
