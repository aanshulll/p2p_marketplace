import mongoose, { Schema } from "mongoose";

const transSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",  // Reference to Product model
      required: true
    },
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: "User",  // Reference to User model
      required: true
    },
    transactionDate: {
      type: Date,
      default: Date.now  // Auto-assign current timestamp
    },
    amount: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }  // Enables createdAt and updatedAt fields
);

export const Transaction = mongoose.model("Transaction", transSchema);
