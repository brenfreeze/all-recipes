import type { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, Fields, Files, File } from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), "/public/uploads");

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = new IncomingForm({
    uploadDir: uploadDir,
    keepExtensions: true,
  });

  return new Promise<void>((resolve, reject) => {
    form.parse(req, (err: Error, fields: Fields, files: Files) => {
      if (err) {
        console.error("Error parsing the files:", err);
        res.status(500).json({ message: "File upload failed", error: err.message });
        return resolve();
      }

      const fileArray = files.file as File[];

      if (!fileArray || fileArray.length === 0) {
        res.status(400).json({ message: "No file uploaded" });
        return resolve();
      }

      const file = fileArray[0];
      const newPath = path.join(uploadDir, file.newFilename);

      fs.rename(file.filepath, newPath, (err) => {
        if (err) {
          console.error("Error moving the file:", err);
          res.status(500).json({ message: "File move failed", error: err.message });
          return resolve();
        }

        res.status(200).json({
          message: "File uploaded successfully",
          fileUrl: `${process.env.NEXT_PUBLIC_BASE_URL}uploads/${file.newFilename}`,
        });
        resolve();
      });
    });
  });
};

export default handler;