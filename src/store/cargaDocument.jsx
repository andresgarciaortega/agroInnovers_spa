// import { useState } from "react";

// const UploadComponent = () => {
//   const [file, setFile] = useState(null);

//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]); // Guardamos el archivo seleccionado
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       alert("Selecciona un archivo primero");
//       return;
//     }

//     try {
//       // Genera un UUID y conserva la extensión del archivo original
//       const fileExtension = file.name.split(".").pop(); // Obtiene la extensión
//       const uniqueFileName = `${crypto.randomUUID()}.${fileExtension}`;

//       const uploadUrl = `https://s3.us-east-1.wasabisys.com/agronovers/${uniqueFileName}`;

//       fetch(uploadUrl, {
//         method: "PUT",
//         body: file,
//         headers: {
//           "Content-Type": file.type,
//         },
//       })
//         .then(response => {
//           if (!response.ok) throw new Error(`Error en la subida: ${response.status}`);
//           return response;
//         })
//         .then(() => console.log("Archivo subido con éxito:", uploadUrl))
//         .catch(error => console.error("Error en la subida:", error));

//     } catch (error) {
//       console.error("Error en la subida:", error);
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Subir Archivo</button>
//     </div>
//   );
// };

// export default UploadComponent;


import { useState } from "react";

const useUploadToS3 = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFile = async (file) => {
    if (!file) return null;

    setIsUploading(true);
    setError(null);

    try {
      // Generar un nombre único con UUID y conservar la extensión
      const fileExtension = file.name.split(".").pop();
      const uniqueFileName = `${crypto.randomUUID()}.${fileExtension}`;

      const uploadUrl = `https://s3.us-east-1.wasabisys.com/agronovers/${uniqueFileName}`;

      const response = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!response.ok) throw new Error(`Error en la subida: ${response.status}`);

      return uploadUrl; // Retornamos la URL del archivo subido
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading, error };
};

export default useUploadToS3;

