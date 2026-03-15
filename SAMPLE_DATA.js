// 📝 EJEMPLO: Cómo crear ítems de menú con información cultural y nutricional
// Usa este código en una terminal con MongoDB conectado o mediante un script

const sampleMenuItems = [
  // Ejemplo 1: Arepa de Queso
  {
    "nombre": "Arepa Rellena de Queso",
    "descripcion": "Arepa recién hecha rellena de queso blanco fresco",
    "precio": 5.50,
    "categoria": "plato_fuerte",
    "disponible": true,
    "regionOrigen": "Andes",
    "historiaIngredientes": "Plato tradicional andino elaborado con harina de maíz blanco molida. La arepa es un alimento básico en muchas culturas latinoamericanas, especialmente en los Andes. El queso fresco es un complemento perfecto que añade proteína y sabor.",
    "ingredientePrincipal": "Maíz blanco",
    "nutricion": {
      "calorias": 380,
      "proteinas": 12,
      "grasas": 15,
      "carbohidratos": 48,
      "fibra": 2,
      "sodio": 450
    },
    "contiene": ["gluten", "lactosa"],
    "esVegetariano": true,
    "esVegano": false
  },

  // Ejemplo 2: Ceviche Clásico
  {
    "nombre": "Ceviche de Pescado Clásico",
    "descripcion": "Ceviche fresco con pescado blanco marinado en limón",
    "precio": 8.00,
    "categoria": "plato_fuerte",
    "disponible": true,
    "regionOrigen": "Costa",
    "historiaIngredientes": "Plato típico costero marinero con miles de años de historia. El ceviche es una joya de la cocina costera preparado con pescado fresco marinado en limón con cebolla roja, cilantro y ají.",
    "ingredientePrincipal": "Pescado blanco (mero o robalo)",
    "nutricion": {
      "calorias": 250,
      "proteinas": 32,
      "grasas": 8,
      "carbohidratos": 15,
      "fibra": 1,
      "sodio": 520
    },
    "contiene": ["mariscos"],
    "esVegetariano": false,
    "esVegano": false
  },

  // Ejemplo 3: Ensalada de Quinua
  {
    "nombre": "Ensalada de Quinua Andina",
    "descripcion": "Ensalada nutritiva con quinua, vegetales frescos y vinagreta de limón",
    "precio": 4.50,
    "categoria": "plato_fuerte",
    "disponible": true,
    "regionOrigen": "Puno",
    "historiaIngredientes": "La quinua es un superfood andino que fue alimento sagrado de los incas. Rico en proteína completa, contiene todos los aminoácidos esenciales. Esta región en los Andes es el corazón de la producción de quinua.",
    "ingredientePrincipal": "Quinua orgánica",
    "nutricion": {
      "calorias": 220,
      "proteinas": 8,
      "grasas": 5,
      "carbohidratos": 38,
      "fibra": 4,
      "sodio": 85
    },
    "contiene": [],
    "esVegetariano": true,
    "esVegano": true
  },

  // Ejemplo 4: Locro de Papa
  {
    "nombre": "Locro de Papa Tradicional",
    "descripcion": "Guiso espeso con papas, queso y especias andinas",
    "precio": 6.00,
    "categoria": "plato_fuerte",
    "disponible": true,
    "regionOrigen": "Noroeste Argentino",
    "historiaIngredientes": "El locro es un plato que data del siglo XVII, mezcla de influencias prehispánicas y coloniales españolas. La papa es originaria de los Andes y fue domesticada por civilizaciones indígenas hace miles de años.",
    "ingredientePrincipal": "Papa nativa andina",
    "nutricion": {
      "calorias": 320,
      "proteinas": 10,
      "grasas": 12,
      "carbohidratos": 45,
      "fibra": 3,
      "sodio": 580
    },
    "contiene": ["lactosa"],
    "esVegetariano": true,
    "esVegano": false
  },

  // Ejemplo 5: Chicha Morada (Bebida)
  {
    "nombre": "Chicha Morada Tradicional",
    "descripcion": "Bebida ancestral refrescante de maíz morado",
    "precio": 2.50,
    "categoria": "bebida",
    "disponible": true,
    "regionOrigen": "Perú",
    "historiaIngredientes": "La chicha morada es una bebida que data de la era preincaica. Elaborada con maíz morado peruano, piña, canela y clavo. Rico en antioxidantes naturales.",
    "ingredientePrincipal": "Maíz morado peruano",
    "nutricion": {
      "calorias": 80,
      "proteinas": 0,
      "grasas": 0,
      "carbohidratos": 20,
      "fibra": 0,
      "sodio": 10
    },
    "contiene": [],
    "esVegetariano": true,
    "esVegano": true
  },

  // Ejemplo 6: Postre - Flan de Café
  {
    "nombre": "Flan de Café",
    "descripcion": "Postre cremoso con café y caramelo",
    "precio": 3.50,
    "categoria": "postre",
    "disponible": true,
    "regionOrigen": "Hispanoamérica",
    "historiaIngredientes": "El flan es un postre de origen español adaptado en Latinoamérica. Combinamos el flan tradicional con café, trayendo el sabor de las plantaciones de café andinas.",
    "ingredientePrincipal": "Café 100% arábica andino",
    "nutricion": {
      "calorias": 180,
      "proteinas": 3,
      "grasas": 8,
      "carbohidratos": 25,
      "fibra": 0,
      "sodio": 120
    },
    "contiene": ["lactosa", "huevo"],
    "esVegetariano": true,
    "esVegano": false
  }
];

/*
📝 INSTRUCCIONES PARA USAR ESTOS EJEMPLOS:

1. Con cURL (desde terminal):
   
   curl -X POST http://localhost:5000/api/items \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{JSON_DEL_ITEM}'

2. Con Postman/Insomnia:
   - URL: http://localhost:5000/api/items
   - Método: POST
   - Headers: 
     * Authorization: Bearer YOUR_JWT_TOKEN
     * Content-Type: application/json
   - Body: Copia el JSON del item

3. Con script Node.js:
   Consulta el archivo: QUICKSTART.md

⚠️ NOTA: Necesitas token JWT para crear items (solo admin).
Primero haz login como admin:

curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tianas.com",
    "password": "password123"
  }'
*/
