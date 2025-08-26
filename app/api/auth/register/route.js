import  dbConnect from '@/lib/database';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  console.log('Register route hit');
  try {
    await dbConnect();
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return Response.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword
    });

    return Response.json({ 
      success: true, 
      message: 'Admin user created successfully',
      email: user.email 
    });

  } catch (error) {
    console.error('Registration error:', error);
    return Response.json({ error: 'Failed to create admin user' }, { status: 500 });
  }
} 