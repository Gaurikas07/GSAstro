import type { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import path from "path";
import fs from "fs";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";

export const config = {
  api: { bodyParser: false },
};

const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (
    req: any,
    file: any,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, uploadDir);
  },

  filename: (
    req: any,
    file: any,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const safeName = file.originalname.replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${safeName}`);
  },
});



const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
 fileFilter: (
  _req: any,
  file: any,
  cb: (error: Error | null, acceptFile?: boolean) => void
) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.mimetype)) {
    cb(new Error("Only JPG, PNG, WEBP images allowed"));
  } else {
    cb(null, true);
  }
},


function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: (req: NextApiRequest, res: NextApiResponse, cb: (result?: unknown) => void) => void
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      resolve(result);
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await runMiddleware(req, res, upload.single("image"));
    await connectDB();

    const userId = req.body?.userId as string;
    const file = (req as any).file;


    if (!file || !userId) {
      return res.status(400).json({ error: "userId and image are required" });
    }

    const imagePath = `/uploads/${file.filename}`;

    await User.findByIdAndUpdate(userId, { imagePath });

    return res.status(200).json({ imagePath });
  } catch (error) {
    return res.status(500).json({
      error: "Upload failed",
      details: (error as Error).message,
    });
  }
}
