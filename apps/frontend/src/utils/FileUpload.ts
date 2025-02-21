"use server"
import fs from 'fs'
import { IKUploadResponse } from 'imagekitio-next/dist/types/components/IKUpload/props';
import path from 'path';
import { AttachmentData } from '@devcord/node-prisma/dist/constants/socket.const';
import { imagekit } from '@/app/api/imagekit/auth/route';


type fileUploadType = {
  file: File
  conversationId: string
}

type fileUploadReturnType = {
  error: string | null
  data: AttachmentData | null
}


export async function fileUpload({ file, conversationId }: fileUploadType): Promise<fileUploadReturnType> {
  const tempDir = path.join(process.cwd(), 'frontend', 'public', 'temp');
  const filePath = path.join(tempDir, file.name);

  // Ensure the directory exists
  fs.mkdirSync(tempDir, { recursive: true });

  // Write the file to the directory
  fs.writeFileSync(filePath, Buffer.from(await file.arrayBuffer()));


  const result = await imagekit.upload({
    file: fs.createReadStream(filePath),
    fileName: file.name,
    folder: `/DM/${conversationId}`,
  }).catch((error) => null)

  if (!result) return { error: `Failed to upload ${file.name}!`, data: null }

  const data: AttachmentData = {
    id: result.fileId,
    fileName: result.name,
    size: result.size,
    url: result.url,
    proxyUrl: result.thumbnailUrl,
    contentType: file.type,
    height: result.height,
    width: result.width,
    title: file.name,
  }

  fs.unlinkSync(filePath);

  return { error: null, data: data }
}
