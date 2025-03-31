import { S3Client } from "@aws-sdk/client-s3";
import AWS from "aws-sdk";

// const wasabiConfig = {
//   accessKeyId: "CZL2YNO5SV3BNKI2GEUT", // Reemplaza con tu Access Key
//   secretAccessKey: "CV5dzqPBFhonX39s0wpgdeTq8uzpwAHSczc0oSuK", // Reemplaza con tu Secret Key
//   region: "us-east-1", // Reemplázalo con la región de tu bucket
//   endpoint: "https://s3.wasabisys.com", // Endpoint de Wasabi
// };
// const s3 = new AWS.S3(wasabiConfig);
// export default s3;



// const s3 = new S3Client({
//     region: "us-east-1", // 🔹 Cambia por la región de tu bucket en Wasabi
//     endpoint: "https://s3.us-east-1.wasabisys.com", // 🔹 Endpoint de Wasabi
//     credentials: {
//       accessKeyId: "CZL2YNO5SV3BNKI2GEUT",  // 🔹 Reemplázalo con tus credenciales
//       secretAccessKey: "CV5dzqPBFhonX39s0wpgdeTq8uzpwAHSczc0oSuK", 
//     },
//   });


const s3 = new AWS.S3({
    endpoint: "https://s3.us-east-1.wasabisys.com",
    accessKeyId: import.meta.env.VITE_WASABI_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_WASABI_SECRET_KEY,
    region: "us-east-1",
    signatureVersion: "v4"
});


export default s3;