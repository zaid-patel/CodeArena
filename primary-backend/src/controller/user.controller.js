import { JWT_PASSWORD } from "../config.js";
import jwt from "jsonwebtoken";
import { prismaClient as prisma  } from "../db/index.js";

export const signUpUser = async (req,res) =>{
    const parsedData=req.body;
    // console.log(parsedData)
    if(!parsedData.email || !parsedData.password || !parsedData.username){
        return res.status(400).json("Please provide all the required fields: email, password, and name.");
    }

    

    
   
    
    const existingUser=await prisma.user.findFirst({
        where: 
                
                    { email: parsedData.email }
                
        
    })

    if(existingUser){
        return res.status(411).json("user already exists with the username or email provided");
    }

    await prisma.user.create({
        data:{
            email:parsedData.email,
            password:parsedData.password,
            username:parsedData.username,
            role:parsedData.role || "coder",

        }
    })

    const user=await prisma.user.findFirst({
        where:{
            email:parsedData.email,
        }
    })

    // if(us)

    res.json({
        user,
    });


    return;


}


export const signInUser=async (req, res) => {

    const {email,password}=req.body

    // console.log(email,password);
    

    const user = await prisma.user.findFirst({
        where: {
            email: email,
            password:password
        }
    });
    
    if (!user) {
        return res.status(403).json({
            message: "Sorry credentials are incorrect"
        })
    }

    // sign the jwt
    const token = jwt.sign({
        id: user.id
    }, JWT_PASSWORD);

    
    return res.status(200).json({
        token: token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    });
}


// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        submissions: true,
        participatedContests: true,
        rankings: true,
        authoredProblems: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single user by ID
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        submissions: true,
        participatedContests: true,
        rankings: true,
        authoredProblems: true,
      },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { username, email, password, role },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
