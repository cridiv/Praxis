import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express';
import type { Multer } from 'multer';
import axios from 'axios';
import FormData from 'form-data';

@Controller('upload')
export class UploadController {
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Multer.File) {
        const formData = new FormData();
        formData.append('file', file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype,
        });
        console.log("Uploading file to classifier service...");
        const response = await axios.post(
            'http://localhost:8000/api/classify',
            formData,
            { 
                headers: { 
                    ...formData.getHeaders(),
                } 
            },
        );
        console.log("response: ", response.data)
        return response.data;
    }
}