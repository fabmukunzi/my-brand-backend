import bcrypt from 'bcryptjs';
import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    email:{
        type:String,
    },
    password:{
        type:String,
    }
})
const users=mongoose.model("Users", userSchema);
userSchema.pre(
    'save',
    async function(next) {
      const user = this;
      const hash = await bcrypt.hash(this.password, 10);
  
      this.password = hash;
      next();
    }
);
userSchema.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
  
    return compare;
  }
  
export default users;