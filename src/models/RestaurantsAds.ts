import mongoose, { model, models } from "mongoose";

const RestaurantADSSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    imgsrc: {
      type: String,
      required: [true, "Please add an imgsrc"],
    },
    tel: {
      type: String,
      match: [/^[0-9\-+]{9,15}$/, "Please add a valid phone number"],
    },
    opentime: {
      type: String,
      required: [true, "Please add an open time"],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "Please use HH:mm format"],
    },
    closetime: {
      type: String,
      required: [true, "Please add a close time"],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "Please use HH:mm format"],
    },
  },
  {
    timestamps: true,
  }
);

const RestaurantADS =
  models.restaurantsADS ||
  model("restaurantsADS", RestaurantADSSchema, "restaurantsADS");

export default RestaurantADS;