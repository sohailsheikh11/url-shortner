import User from "../models/AuthModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


export const signup = async (req,res)=>{

  try {

      const {email, password} = req.body;

      console.log(email,password);

    const existing = await User.findOne({email});

    if(existing){
        return res.status(400).json({message: "user already exists"})
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const user = await User.create({
        email,
        password: hashedPassword
    })

    res.status(201).json(user);
    
  } catch (error) {

    console.log(error);

    res.status(500).json("this is the message" + error.message);
  }



}

export const login = async (req,res)=>{

    try {
      const {email, password} = req.body;

      console.log("this is the email and password", email + password);

      const user = await User.findOne({email});

      if(!user){
        res.status(401).json("invalid email");
      }

      console.log("this is the user", user);

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if(!isPasswordMatch){

        res.status(403).json({message: "incorrect password"})

      }

      const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(201).json({token});


        
    } catch (error) {

        res.status(501).json(error.message);
        
    }

}