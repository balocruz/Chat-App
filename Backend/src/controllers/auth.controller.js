import { registerUser as createUser, loginUser,getUser} from "../Services/auth.service.js";

const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await createUser({ name, username, email, password });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        token: user.token,
      },
    });
  } catch (error) {
    if(error.message === "User already exists"){
      res.status(400).json({message:"User already exists"})
    }else{
    console.error("Error registering user:", "Error:", error);

    res.status(500).json({ message: "Server error" });
    }
  }
};

const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if ((!username && !email) || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await loginUser({ username, email, password });
    res.status(200).json({ message: "User logged in successfully", user });
  } catch (error) {
    if (error.message === "Invalid credentials") {
      console.error("Error logging in user:", error);
      res.status(401).json({ message: "Invalid credentials" });
    } else {
      console.log("Server error", error);
      res.status(500).json({ message: "Server error" });
    }
  }
};

const getMe = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await getUser(id);
    if(!user){
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User found", user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { register, login, getMe };
