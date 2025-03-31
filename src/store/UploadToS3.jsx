// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// const UploadToS3 = async (file) => {
//     const s3Client = new S3Client({
//         region: import.meta.env.VITE_AWS_REGION,
//         credentials: {
//             accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
//             secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
//         },
//     });

//     const params = {
//         Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
//         Key: `${Date.now()}_${file.name}`,
//         Body: file,
//         ContentType: file.type,
//     };

//     try {
//         const command = new PutObjectCommand(params);
//         await s3Client.send(command);
//         return `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
//     } catch (error) {
//         console.error('Error subiendo el archivo:', error);
//         throw new Error('Error al cargar el archivo a S3');
//     }
// };

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "us-east-1",
  endpoint: "https://s3.us-east-1.wasabisys.com",
  credentials: {
    accessKeyId: import.meta.env.VITE_WASABI_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_WASABI_SECRET_KEY,
  },
});

export const uploadFileToWasabi = async (file) => {
  try {
    const params = {
      Bucket: "agronovers",
      Key: file.name,
      Body: file,
      ContentType: file.type,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);
    return `https://agronovers.s3.us-east-1.wasabisys.com/${file.name}`;
  } catch (error) {
    console.error("Error al subir archivo:", error);
    return null;
  }
};
