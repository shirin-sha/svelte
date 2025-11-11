import dbConnect  from '@/lib/database';
import User from '@/models/User';

export async function POST(req) {
  await dbConnect();
  const { email, password } = await req.json();
  const user = await User.findOne({ email });
  if (!user) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  // Plain text comparison (no hashing)
  if (password !== user.password) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  // Return a simple token string; client only checks presence
  return Response.json({ token: 'admin' });
} 