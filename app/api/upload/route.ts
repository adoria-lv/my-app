// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { uploadToS3 } from '@/lib/s3-upload'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'slider'

    if (!file) {
      return NextResponse.json({ error: 'Nav faila' }, { status: 400 })
    }

    const url = await uploadToS3(file, folder)

    return NextResponse.json({ url }, { status: 200 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Kļūda augšupielādējot failu' },
      { status: 500 }
    )
  }
}
