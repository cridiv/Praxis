import { Controller, Post, UploadedFile, UseInterceptors, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import axios from 'axios';
import FormData from 'form-data';
import type { Request } from 'express';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    // ✅ Access form fields from req.body (not @Body)
    const description = req.body.description;

    if (!file) return { error: 'No file uploaded' };
    if (!description) return { error: 'Description is missing' };

    console.log('📦 File received:', file.originalname);
    console.log('📝 Description received:', description);

    const formData = new FormData();
    formData.append('files', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
    formData.append('description', description); // ✅ Properly appended

    const response = await axios.post('http://localhost:8000/api/evaluate', formData, {
      headers: formData.getHeaders(),
    });

    console.log('✅ Evaluation complete');
    return response.data;
  }
}
