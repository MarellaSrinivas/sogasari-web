
const API_ORIGIN = "https://sogasari.com";

export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return "/images/placeholder.jpg";
  }

  // Already a complete URL
  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://")
  ) {
    // Convert old localhost URLs to production
    if (imagePath.includes("localhost:8080")) {
      return imagePath.replace(
        "http://localhost:8080",
        API_ORIGIN
      );
    }

    return imagePath;
  }

  // Remove leading slash
  const cleanPath = imagePath.startsWith("/")
    ? imagePath.substring(1)
    : imagePath;

  // Old image path stored as /images/...
  // Actual files are served from /uploads/...
  if (cleanPath.startsWith("images/")) {
    return `${API_ORIGIN}/uploads/${cleanPath.substring(7)}`;
  }

  // Normal upload path
  if (cleanPath.startsWith("uploads/")) {
    return `${API_ORIGIN}/${cleanPath}`;
  }

  return `${API_ORIGIN}/${cleanPath}`;
}; 
