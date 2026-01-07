import fs from "fs";
import path from "path";

type UploadFile = {
  buffer: Buffer;
  originalname: string;
};

const PUBLIC_UPLOAD_PATH = path.resolve(
  __dirname,
  "../../public/bloodDonationReport"
);

export const uploadBloodDonationReport = async (
  file: UploadFile
): Promise<string> => {
  if (!fs.existsSync(PUBLIC_UPLOAD_PATH)) {
    fs.mkdirSync(PUBLIC_UPLOAD_PATH, { recursive: true });
  }

  const fileName = `${Date.now()}-${file.originalname}`;
  const filePath = path.join(PUBLIC_UPLOAD_PATH, fileName);

  await fs.promises.writeFile(filePath, file.buffer);

  return `/bloodDonationReport/${fileName}`;
};
