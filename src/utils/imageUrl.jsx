const API_ORIGIN = "http://localhost:8080";

export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return "/images/placeholder.jpg";
  }

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://")
  ) {
    return imagePath;
  }

  return `${API_ORIGIN}${imagePath}`;
};