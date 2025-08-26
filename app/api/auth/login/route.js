import dbConnect  from '@/lib/database';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  await dbConnect();
  const { email, password } = await req.json();
  const user = await User.findOne({ email });
  if (!user) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
  return Response.json({ token });
} 