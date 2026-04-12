import mongoose, {models, model} from "mongoose";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const UserSchema = new mongoose.Schema({
    name: {
        type:  String,
        required: [true, 'Please add a name'],
    },
    email: {
        type:  String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email'
        ]
    },
    telephone: {
        type:  String,
        required: [true, 'Please add a telephone number'],
        unique: true,
        match: [
            /^0[689][0-9]{8}$/,
            'Please add a valid telephone number'
        ]
    },
    role: {
        type:  String,
        enum:['user', 'admin'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true,'Please add a password'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt:{
        type: Date,
        default: Date.now
    },
});

UserSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.getSignedJwtToken = async function(){
    const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return await new SignJWT({ id: this._id.toString(), role: this.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRE || "7d")
    .sign(new TextEncoder().encode(secret));
};

UserSchema.methods.matchPassword = async function(enteredPassword: string){
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = models.User || model("User", UserSchema);
export default User;