import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Configura el cliente S3
const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});


let credentialses = {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  }

  
  
  // Función para subir un archivo a S3 usando una URL pre-firmada
  const UploadToS3 = async (file) => {
    console.log("credentialses : ", credentialses)
  if (!(file instanceof File)) {
    throw new Error('El archivo no es un objeto File válido');
  }

  const bucketName = 'tag-storage-documents';
  const key = `${Date.now()}_${file.name}`; // Nombre único del archivo

  try {
    // 1. Generar una URL pre-firmada
    const putObjectParams = {
      Bucket: bucketName,
      Key: key,
      ContentType: file.type, // Asegúrate de incluir el tipo de contenido
    };

    const putObjectCommand = new PutObjectCommand(putObjectParams);
    const signedUrl = await getSignedUrl(s3Client, putObjectCommand, { expiresIn: 3600 }); // Expira en 1 hora

    // 2. Subir el archivo usando la URL pre-firmada
    const uploadResponse = await fetch(signedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type, // Asegúrate de incluir el tipo de contenido
      },
    });

    if (!uploadResponse.ok) {
      throw new Error('Error al subir el archivo a S3');
    }

    // 3. No retornar nada (cumpliendo con tu requisito)
    console.log('Archivo subido con éxito.');
  } catch (error) {
    console.error('Error subiendo el archivo:', error);
    throw new Error('Error al cargar el archivo a S3');
  }
};

export default UploadToS3;