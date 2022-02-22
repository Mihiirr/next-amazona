import Mongoose from "mongoose";

const userSchema = new Mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },

}, {
    timestamps: true
});

const User = Mongoose.models.User || Mongoose.model("User", userSchema)

export default User