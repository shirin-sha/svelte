import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('image');
  const type = formData.get('type') || 'general'; // 'services', 'blogs', or 'general'

  if (!file || typeof file === 'string') {
    return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create subdirectory based on type
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', type);

  // Create the uploads folder and subdirectory if they don't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Generate a unique file name
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
  const filePath = path.join(uploadDir, fileName);

  try {
    await writeFile(filePath, buffer);
    
    // Verify file was written
    if (!fs.existsSync(filePath)) {
      console.error('File was not created:', filePath);
      return new Response(JSON.stringify({ error: 'File was not saved' }), {
        status: 500
      });
    }
    
    // Return the URL with subdirectory (relative path works for Next.js static files)
    const url = `/uploads/${type}/${fileName}`;
    console.log('File uploaded successfully:', { filePath, url, size: buffer.length, type });
    
    return new Response(JSON.stringify({ url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error saving file:', error);
    return new Response(JSON.stringify({ error: 'Failed to save file', details: error.message }), {
      status: 500
    });
  }
}
