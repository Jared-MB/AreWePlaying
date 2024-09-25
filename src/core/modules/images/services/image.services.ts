import r2 from "@/core/utils/r2"; // Importa el cliente r2
import { PutObjectCommand } from "@aws-sdk/client-s3"; // Importa el comando de subida

// Parámetros para subir una imagen de equipo universitario
interface UploadImageServiceParams {
    image: File; // Archivo de imagen
    imageId: string; // UUID de la imagen
    teamName: string; // Nombre del equipo
    universityId: string; // ID de la universidad
    safe?: boolean; // Si es true, no lanza error si la imagen es mayor de 500KB
}

// Función para generar una clave única (key) basada en el equipo y universidad
const getKey = ({
    imageId,
    teamName,
    universityId,
}: {
    imageId: string;
    teamName: string;
    universityId: string;
}): string => {
    const sanitizedTeamName = teamName.replace(/\s+/g, '-').toLowerCase(); // Limpiar espacios y convertir a minúsculas
    return `${sanitizedTeamName}/${universityId}/${imageId}-${Date.now()}`; // Clave única con timestamp
};

// Servicio para subir imagen de equipo universitario
export const uploadImageService = async ({
    image,
    imageId,
    teamName,
    universityId,
    safe = false,
}: UploadImageServiceParams): Promise<{ url: string; id: string } | null> => {
    // Verificar tamaño de la imagen
    if (!image || image.size === 0) return null;
    if (image.size > 500000) {
        if (safe) return null;
        throw new Error("La imagen no puede pesar más de 500KB");
    }

    // Generar una clave única para la imagen
    const imageKey = getKey({
        imageId,
        teamName,
        universityId,
    });

    // Convertir la imagen a un buffer
    const buffer = await image.arrayBuffer();

    // Subir la imagen usando PutObjectCommand
    const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME, // Nombre del bucket en las variables de entorno
        Key: imageKey, // Clave única para la imagen
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        Body: buffer as any,
        ContentType: image.type,
        CacheControl: "max-age=259200", // 3 días de caché
    });

    await r2.send(command);

    // Retornar la URL de la imagen subida
    const url = `https://are-we-playing.kristall.app/${imageKey}`;
    return { url, id: imageId };
};


