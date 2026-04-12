import mongoose, { model, models } from "mongoose";

const ReservationSchema = new mongoose.Schema({
    startDateTime: {
        type: Date,
        required: true,
    }, 
    endDateTime: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    restaurant: {
        type: mongoose.Schema.ObjectId,
        ref: 'Restaurant',
        required: true,
    }
});

const Reservation = models.Reservation || model("Reservation", ReservationSchema);
export default Reservation;