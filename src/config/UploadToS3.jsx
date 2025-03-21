
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Función que carga el archivo a S3 y devuelve la URL
const UploadToS3 = async (file) => {
    const s3Client = new S3Client({
        region: 'us-east-1',
        credentials: {
            accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
            secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
        },
    });

    const params = {
        Bucket: 'huila-storage',
        Key: `${Date.now()}_${file.name}`, // Nombre único del archivo
        Body: file,
        ContentType: file.type,
    };

    try {
        const command = new PutObjectCommand(params);
        await s3Client.send(command);
        return `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
    } catch (error) {
        console.error('Error subiendo el archivo:', error);
        throw new Error('Error al cargar el archivo a S3');
    }
};


export default UploadToS3;