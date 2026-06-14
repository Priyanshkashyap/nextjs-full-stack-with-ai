// refer to mongoose with typescript docs
import mongoose, { Schema, Document } from "mongoose"; 
// schema is a class to create a new schema
//Interface = TypeScript (compile-time, no runtime)
//Schema = Mongoose (runtime, database behavior)

//so actually u dont need the interface part.but if we ever need to change the schema , having an interface makes it easier for typescript correctness
export interface Message extends Document { // document is like JPA repository which has fields like _id(id in object form where as id gives id in string form) and gives access to methods like save,add,etc.
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,   // interfact ke data types ka error yaha aata during compiletime
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

export interface User extends Document { // yaha types define me small letters but schema vaale me capital
  username: string; 
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified:boolean,
  isAcceptingMessage: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: [true, "Email is required"], // Field must be present,If missing → Mongoose throws validation error
    unique: true,
    match: [/.+\@.+\..+/, "please use a valid email address"] // Validates using a regular expression (regex) thus Ensures email format is correct,else throws validation error
  },
  password: {
    type: String,
    required: [true, "password is required"]
  },
  verifyCode: {
    type: String,
    required: [true, "verifyCode is required"]
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "verify Code Expiry is required"]
  },
  isVerified: {
    type: Boolean,
    default: false, 
  },
  isAcceptingMessage:{
    type: Boolean,
    default: true, 
  },
  messages:[MessageSchema],
})
// nextjs doesnt know unlike react that ur server iss booted up first time or multiple times before as  files reload frequently or hot reload or APIs rerun many times during development
  const UserModel =
  (mongoose.models.User as mongoose.Model<User>) || // either find User model from mongoose.models . mongoose.Model<User> is A mongoose model whose documents follow the IUser interface
  mongoose.model<User>("User", UserSchema); // or create one if it doesnt exist

export default UserModel;
//A model is basically the thing you use to interact with MongoDB(eg find,create,delete,etc.)import mongoose from "mongoose";
