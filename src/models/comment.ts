import mongoose, { Schema, model, models, Types, Document } from "mongoose";

export interface IComment extends Document {
  r_id: Types.ObjectId;
  u_id: Types.ObjectId;
  text: string;
  star: number;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    r_id: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },
    u_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    star: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: "Star must be integer",
      },
    },
  },
  { timestamps: true }
);

const Comment =
  models.Comment || model<IComment>("Comment", CommentSchema);

export default Comment;