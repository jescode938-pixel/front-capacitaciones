// Detecta si una URL es de Google Drive y extrae el ID del archivo
export function extraerDriveId(url) {
  if (!url) return null;
  const limpio = url.trim();

  // Formatos soportados:
  // - https://drive.google.com/file/d/ID/view?usp=sharing
  // - https://drive.google.com/open?id=ID
  // - https://drive.google.com/uc?id=ID
  // - https://drive.google.com/thumbnail?id=ID

  // Formato /file/d/ID/...
  const matchFileD = limpio.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFileD) return matchFileD[1];

  // Formato ?id=ID o &id=ID
  const matchId = limpio.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchId) return matchId[1];

  return null;
}

// Devuelve la URL apropiada para mostrar en un <img>
export function getDriveImageUrl(url, size = 1024) {
  const id = extraerDriveId(url);
  if (!id) return url; // no es Drive, devolver tal cual

  // thumbnail es el endpoint que sí sirve imágenes en <img>
  return `https://drive.google.com/thumbnail?id=${id}&sz=s${size}`;
}

// Devuelve la URL apropiada para mostrar en un <iframe> (PDFs, docs)
export function getDrivePreviewUrl(url) {
  const id = extraerDriveId(url);
  if (!id) return url;

  // preview es el endpoint para visualización embebida de documentos
  return `https://drive.google.com/file/d/${id}/preview`;
}

// Devuelve la URL para abrir el archivo en Drive (fallback)
export function getDriveOpenUrl(url) {
  const id = extraerDriveId(url);
  if (!id) return url;
  return `https://drive.google.com/file/d/${id}/view`;
}

// Detecta si es un enlace de Drive
export function esDrive(url) {
  return extraerDriveId(url) !== null;
}

// Resuelve la URL según el tipo de archivo
// - Imagen: usa thumbnail
// - Documento: usa preview
export function resolverUrlArchivo(url, fileType) {
  if (!url) return '';
  if (!esDrive(url)) return url; // no es Drive, usar tal cual

  if (fileType === 'image') {
    return getDriveImageUrl(url);
  }

  // document, PDF, etc.
  return getDrivePreviewUrl(url);
}