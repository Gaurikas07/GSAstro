import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      default: "",
      index: true,
    },

    password: { type: String, required: true },

    birthDate: { type: String, default: "" },
    birthTime: { type: String, default: "" },
    birthPlace: { type: String, default: "" },

    balance: { type: Number, default: 0 },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    imagePath: { type: String, default: "" },

    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export type IUser = mongoose.InferSchemaType<typeof UserSchema> & {
  _id: string;
};

export default models.User || model("User", UserSchema);
