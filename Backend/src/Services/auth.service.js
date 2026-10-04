import User from "../models/user.model.js";
import bcrypt from "bcrypt"; 
import jwt from "jsonwebtoken";

//const JWT_SECRET = process.env.JWT_SECRET;

const registerUser = async ({ name, username, email, password }) => {
  
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
   if (existingUser) {
     throw new Error("User already exists");
    }
  
  const hashedPassword = await bcrypt.hash(password, 10);
 
  const user = new User({ name, username, email, password: hashedPassword });

  await user.save();
  const {password: _, ...userWithoutPassword} = user.toObject();
   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  return { ...userWithoutPassword, token };
};

const loginUser = async ({ username, email, password }) => {
  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (!user) {
    throw new Error("Invalid credentials");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  const { password: _, ...userWithoutPassword } = user.toObject();
  return { ...userWithoutPassword, token };
};

const getUser = async (userId)=>{
  const user = await User.findById(userId).select("-password");
  return user;
};

export { registerUser, loginUser, getUser };
