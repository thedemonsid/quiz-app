import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import pdf from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const formData: FormData = await req.formData();
    const uploadedFiles = formData.getAll("filepond");

    if (uploadedFiles.length > 0) {
      const uploadedFile = uploadedFiles[0]; // Use the first file

      if (uploadedFile instanceof File) {
        const fileName = uploadedFile.name.toLowerCase();
        const tempFilePath = `/tmp/${fileName}`; // Temporary file path
        const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());

        // Save the uploaded file to the temporary path
        const response = await fs.writeFile(tempFilePath, fileBuffer);
        console.log("File saved to:", tempFilePath, response);

        // Parse the PDF to extract text
        const dataBuffer = await fs.readFile(tempFilePath);
        const data = await pdf(dataBuffer);
        const parsedText = data.text;

        // Return the extracted text as JSON response
        return NextResponse.json(
          { message: "PDF converted successfully", text: parsedText },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Uploaded file is not in the expected format" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json({ message: "No files found" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "An error occurred during processing." },
      { status: 500 }
    );
  }
}
