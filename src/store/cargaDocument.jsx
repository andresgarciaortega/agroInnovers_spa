
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

