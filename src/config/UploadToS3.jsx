// // src/config/UploadToS3.js
// import React, { useState } from 'react';
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// const UploadToS3 = () => {
//     // Estado para manejar el archivo seleccionado
//     const [file, setFile] = useState(null);
//     const [message, setMessage] = useState('');

//     console.log("import.meta.env.VITE_AWS_ACCESS_KEY_ID ",import.meta.env.VITE_AWS_ACCESS_KEY_ID)
//     console.log("import.meta.env.VITE_AWS_SECRET_ACCESS_KEY ",import.meta.env.VITE_AWS_SECRET_ACCESS_KEY)

    
//     // Crear un cliente S3
//     const s3Client = new S3Client({
//         region: 'us-east-1', // Reemplaza con tu región
//         credentials: {
//             accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID, // Usa import.meta.env para Vite
//             secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
//         },
//     });

//     const handleFileChange = (e) => {
//         setFile(e.target.files[0]);
//     };

//     const uploadFile = async () => {
//         if (!file) {
//             setMessage('Por favor selecciona un archivo primero');
//             return;
//         }

//         console.log("file upload : ", file)

//         // Configurar los parámetros para S3
//         const params = {
//             Bucket: 'huila-storage', // Cambia por el nombre de tu bucket
//             Key: `${Date.now()}_${file.name}`, // Nombre único para evitar colisiones
//             Body: file,
//             ContentType: file.type,
//         };

//         try {
//             // Crear el comando para subir el archivo
//             const command = new PutObjectCommand(params);
//             const data = await s3Client.send(command);
//             console.log('Archivo subido con éxito:', data);
//             setMessage(`Archivo cargado con éxito. URL: https://${params.Bucket}.s3.amazonaws.com/${params.Key}`);
//         } catch (err) {
//             console.error('Error subiendo el archivo:', err);
//             setMessage('Hubo un error al cargar el archivo.');
//         }
//     };

//     return (
//         <>
//             <h2>Cargar archivos a S3</h2>
//             <input type="file" accept=".pdf, image/*" onChange={handleFileChange} />
//             <button onClick={uploadFile}>Cargar a S3</button>
//             {message && <p>{message}</p>}
//         </>
//     );
// };

// export default UploadToS3;

// src/utils/uploadFileToS3.js




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