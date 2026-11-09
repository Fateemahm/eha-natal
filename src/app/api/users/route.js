import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

// export async function GET() {
//   return Response.json({ 
//     // Changed the text here from hello world to Users API is working
//     message: "Users API is working"
//   })
// }


export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });

    return Response.json(
      { users },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);

    return Response.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}


export async function POST(request) {
  // added the try catch block to handle errors
  try {
  const body = await request.json()
  const{email, firstName, lastName, password} = body
  const userAlreadyExists = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (userAlreadyExists) {
    return Response.json({ message: 'User already exists' }, { status: 400 })
  }
const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      password: hashedPassword
    }
  })
  return Response.json({ message: 'User created'})

  } catch (error) {
    console.error('Error creating user:', error);
    return Response.json({ message: 'Error creating user' }, { status: 500 });
  } 
}  
