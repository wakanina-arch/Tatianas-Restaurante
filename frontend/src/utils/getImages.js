// src/utils/getImages.js

// Mapeo de categorías a rutas de carpetas
const categoryPaths = {
  'Primero': '/img/Complementos/',
  'Segundo': '/img/Ensaladas/',
  'Postre': '/img/Bebidas/',
  'Otras': '/img/Otras/'
};

// Mock de imágenes para desarrollo (sin backend)
const mockImages = {
  'Primero': [
    '/img/Complementos/Alitas1.png',
    '/img/Complementos/Alitas2.png',
    '/img/Complementos/Bistec convinado.png',
    '/img/Complementos/Bowl Patatas fritas.png',
    '/img/Complementos/Combos.png',
    '/img/Complementos/Nachos con queso.png',
    '/img/Complementos/Palomitas de maiz.png',
    '/img/Complementos/Pincho de verduras.png',
    '/img/Complementos/Pinchos morunos.png',
    '/img/Complementos/Pollo broster.png',
    '/img/Complementos/Tabla flamenca.png'
  ],
  'Segundo': [
    '/img/Ensaladas/Ensalada Alemana de Patata.jpg',
    '/img/Ensaladas/Ensalada Caprese.jpg',
    '/img/Ensaladas/Ensalada César.jpg',
    '/img/Ensaladas/Coleslaw.jpg',
    '/img/Ensaladas/Ensalada Griega.jpg',
    '/img/Ensaladas/Ensalada Mimosa.jpg',
    '/img/Ensaladas/Ensalada Nizarda.jpg',
    '/img/Ensaladas/Ensalada Tabulé.jpg',
    '/img/Ensaladas/Ensalada Waldorf.jpg',
    '/img/Ensaladas/Ensalada Rusa.jpg'
  ],
  'Postre': [
    '/img/Bebidas/AguaMineral.jpg',
    '/img/Bebidas/CervezaClub.jpg',
    '/img/Bebidas/CervezaGuinness.jpg',
    '/img/Bebidas/CervezaHeineken.jpg',
    '/img/Bebidas/CocaCola.jpg',
    '/img/Bebidas/Fanta.jpg',
    '/img/Bebidas/Guarana.jpg',
    '/img/Bebidas/Pepsi.jpg',
    '/img/Bebidas/ZumoDeFrutas.jpg',
    '/img/Bebidas/ZumosVerdes.jpg'
  ],
  'Otras': [
    '/img/Pizzas/Carbonara.jpg',
    '/img/Pizzas/Champiñones.jpg',
    '/img/Pizzas/Cuatro Quesos.jpg',  
    '/img/Pizzas/Hawaiana.jpg',
    '/img/Pizzas/Marguerita.jpg',
    '/img/Pizzas/Marinera.jpg',
    '/img/Pizzas/Napolitana.jpg',
    '/img/Pizzas/Peperoni.jpg',
    '/img/Pizzas/Rústica.jpg'
  ]
};

/**
 * Obtiene la ruta de la carpeta para una categoría
 * @param {string} category - Nombre de la categoría
 * @returns {string} Ruta de la carpeta
 */
export const getCategoryPath = (category) => {
  return categoryPaths[category] || categoryPaths['Otras'];
};

/**
 * Obtiene imágenes simuladas para una categoría (modo desarrollo)
 * @param {string} category - Nombre de la categoría
 * @returns {Array} Lista de rutas de imágenes
 */
export const getMockImagesByCategory = (category) => {
  return mockImages[category] || mockImages['Otras'];
};

/**
 * Obtiene imágenes reales desde el servidor (modo producción)
 * @param {string} category - Nombre de la categoría
 * @returns {Promise<Array>} Promesa con la lista de imágenes
 */
export const getImagesByCategory = async (category) => {
  const path = getCategoryPath(category);
  
  try {
    // En producción, esto sería una llamada real a tu backend
    // const response = await fetch(`/api/images?path=${encodeURIComponent(path)}`);
    // const data = await response.json();
    // return data.images;
    
    // Por ahora, usamos mock
    return mockImages[category] || mockImages['Otras'];
  } catch (error) {
    console.error('Error cargando imágenes:', error);
    return [];
  }
};

/**
 * Extrae el nombre del archivo sin extensión y lo formatea
 * @param {string} imagePath - Ruta completa de la imagen
 * @returns {string} Nombre formateado
 */
export const formatImageName = (imagePath) => {
  const fileName = imagePath.split('/').pop().split('.')[0];
  return fileName
    .replace(/[-_]/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/\s+/g, ' ')
    .trim();
};

export default {
  getCategoryPath,
  getMockImagesByCategory,
  getImagesByCategory,
  formatImageName
};