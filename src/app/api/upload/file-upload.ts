// app/api/upload/route.ts
import formidable, { File } from 'formidable';
import pdf from 'pdf-parse';
import { NextResponse } from 'next/server';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // Disable body parsing for formidable to handle multipart/form-data
  },
};



// import { openai } from '@ai-sdk/openai'
// import { StreamingTextResponse, streamText } from 'ai'
 
// export async function POST(req: Request) {
//   const { messages } = await req.json()
//   const result = await streamText({
//     model: openai('gpt-4-turbo'),
//     messages,
//   })
 
//   return new StreamingTextResponse(result.toAIStream())
// }




// Define the POST method handler for the API route
export async function POST(req: Request) {
    console.log('POST request received');
  const form = new formidable.IncomingForm();

  return new Promise((resolve) => {
    // Parse the incoming request
    form.parse(req, async (err, fields, files) => {
      if (err) {
        // Handle parsing errors
        return resolve(NextResponse.json({ error: 'Error parsing the file.' }, { status: 500 }));
      }

      // Check if the file is uploaded
      if (!files.file || files.file.length === 0) {
        return resolve(NextResponse.json({ error: 'No file uploaded.' }, { status: 400 }));
      }

      // Type assertion for the uploaded file
      const pdfFile: File = files.file[0];
      // Read the uploaded PDF file into a buffer
      const pdfBuffer = fs.readFileSync(pdfFile.filepath);

      try {
        // Parse the PDF buffer
        const data = await pdf(pdfBuffer);
        const text = data.text; // Get the text content from the PDF
        const words = text.split(/\s+/); // Split by whitespace into an array of words
        const chunks: { range: string; content: string }[] = []; // Array to hold text chunks
        
        // Chunk the text into 1000-word sections
        for (let i = 0; i < words.length; i += 1000) {
          const chunkContent = words.slice(i, i + 1000).join(' ');
          const range = `${i}-${Math.min(i + 1000, words.length)}`; // Calculate the range
          chunks.push({ range, content: chunkContent }); // Push the chunk into the array
        }

        // Send the chunks back to the client as a JSON response
        return resolve(NextResponse.json(chunks));
      } catch (error) {
        console.error(error);
        // Handle errors during PDF reading
        return resolve(NextResponse.json({ error: 'Error reading PDF file.' }, { status: 500 }));
      }
    });
  });
}
