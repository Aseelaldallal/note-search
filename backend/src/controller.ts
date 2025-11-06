import { Request, Response } from 'express';

export const uploadFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    // Multer adds files to req.files when using .array()
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({ error: 'No files uploaded' });
      return;
    }

    // Log uploaded file details
    console.log(`Received ${files.length} file(s):`);
    files.forEach(file => {
      console.log(`- ${file.originalname} (${file.size} bytes) -> ${file.path}`);
    });

    // Return success response with file metadata
    const fileDetails = files.map(file => ({
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype
    }));

    res.json({
      message: 'Files uploaded successfully',
      files: fileDetails
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
};