import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('image');

  if (!file || typeof file === 'string') {
    return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Simple flat structure
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');

  // Create the uploads folder if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Generate a unique file name (simple)
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
    
    // Return the URL (simple)
    const url = `/uploads/${fileName}`;
    console.log('File uploaded successfully:', { filePath, url, size: buffer.length });
    
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
