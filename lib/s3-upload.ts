// lib/s3-upload.ts
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
})

export async function uploadToS3(file: File, folder: string = 'slider'): Promise<string> {
  const timestamp = Date.now()
  const filename = `${folder}/${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: filename,
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: file.type,
  })

  await s3Client.send(command)
  
  return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${filename}`
}

export async function deleteFromS3(url: string): Promise<void> {
  const key = url.split('.amazonaws.com/')[1]
  if (!key) return

  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
  })

  await s3Client.send(command)
}

export async function getPresignedUploadUrl(filename: string, contentType: string): Promise<string> {
  const timestamp = Date.now()
  const key = `slider/${timestamp}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
  })

  return await getSignedUrl(s3Client, command, { expiresIn: 3600 })
}
