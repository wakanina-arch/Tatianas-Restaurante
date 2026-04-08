# 📚 Guía de Integración - TicketsCollection

## ¿Qué es TicketsCollection?

Un componente React que muestra todos los tickets guardados del cliente con:

- Visualización elegante
- Búsqueda/filtrado
- Estadísticas
- Acciones (ver, eliminar, exportar)

---

## Instalación en tu App

### 1. Importar el Componente

```jsx
import TicketsCollection from "./components/TicketsCollection";
```

### 2. Usarlo en una Página

**Opción A: Página dedicada**

```jsx
// pages/MisTickets.jsx
import TicketsCollection from "../components/TicketsCollection";

export default function MisTicketsPage() {
  return (
    <div style={{ padding: "1rem" }}>
      <TicketsCollection />
    </div>
  );
}
```

**Opción B: Modal o drawer**

```jsx
// En tu componente
const [showCollection, setShowCollection] = useState(false);

return (
  <>
    <button onClick={() => setShowCollection(true)}>📚 Ver mis Oráculos</button>

    {showCollection && (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "white",
          zIndex: 1000,
        }}
      >
        <button
          onClick={() => setShowCollection(false)}
          style={{ position: "absolute", top: 10, right: 10 }}
        >
          ✕
        </button>
        <TicketsCollection />
      </div>
    )}
  </>
);
```

**Opción C: En un drawer/modal existente**

```jsx
import TicketsCollection from "../components/TicketsCollection";
import Drawer from "your-ui-library"; // Cualquier drawer

return (
  <Drawer
    open={isOpen}
    onClose={() => setIsOpen(false)}
    title="📚 Mi Colección de Oráculos"
  >
    <TicketsCollection />
  </Drawer>
);
```

---

## Personalización

### Estilos Personalizados

El componente usa inline styles, puedes modificarlos directamente en el archivo reemplazando las variables CSS:

```javascript
// En TicketsCollection.jsx
const styles = {
  container: {
    maxWidth: "600px", // ← Cambiar ancho
    // ...
  },
  title: {
    color: "var(--verde-selva)", // ← Cambiar color del título
  },
  // ... más estilos
};
```

### O envolver en un estilo global

```css
/* tu-archivo.css */
.tickets-collection {
  background: linear-gradient(to bottom, #f0f0f0, #fff);
  border-radius: 20px;
  padding: 20px;
}
```

---

## Eventos y Callbacks

### Actualmente sin props

El componente es autónomo. Si necesitas que reaccione a eventos externos:

**Versión mejorada (si lo necesitas):**

```jsx
// components/TicketsCollection.jsx - MODIFICADO
export default function TicketsCollection({ onTicketDeleted, onTicketOpened }) {
  const handleDelete = (ticketId) => {
    // ... código existente ...
    if (onTicketDeleted) onTicketDeleted(ticketId);
  };

  const handleOpen = (ticketId) => {
    // ... código existente ...
    openTicketFromCollection(ticketId);
    if (onTicketOpened) onTicketOpened(ticketId);
  };

  // ...
}
```

Entonces usarlo así:

```jsx
<TicketsCollection
  onTicketDeleted={(id) => console.log("Deleted:", id)}
  onTicketOpened={(id) => console.log("Opened:", id)}
/>
```

---

## Ejemplo Completo - Página Principal

```jsx
// pages/HomePage.jsx
import { useState } from "react";
import TicketsCollection from "../components/TicketsCollection";

export default function HomePage() {
  const [tabActive, setTabActive] = useState("home"); // 'home' | 'tickets'

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          borderBottom: "1px solid #ccc",
          padding: "1rem",
        }}
      >
        <button
          onClick={() => setTabActive("home")}
          style={{
            padding: "0.5rem 1rem",
            background: tabActive === "home" ? "#6366f1" : "transparent",
            color: tabActive === "home" ? "white" : "inherit",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          🏠 Inicio
        </button>
        <button
          onClick={() => setTabActive("tickets")}
          style={{
            padding: "0.5rem 1rem",
            background: tabActive === "tickets" ? "#6366f1" : "transparent",
            color: tabActive === "tickets" ? "white" : "inherit",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          📚 Mis Oráculos
        </button>
      </div>

      {/* Contenido */}
      <div style={{ padding: "1rem" }}>
        {tabActive === "home" && (
          <div>
            <h1>🎭 Bienvenido a Tatiana's</h1>
            <p>Realiza tu compra y recibe tu ticket con un Oráculo especial</p>
          </div>
        )}

        {tabActive === "tickets" && <TicketsCollection />}
      </div>
    </div>
  );
}
```

---

## Funcionalidades Internas

### Al abrir un ticket ("Ver Completo")

```javascript
// Se abre en una nueva ventana el HTML completo
// Cliente puede:
// - Imprimir (Ctrl+P)
// - Guardar como PDF
// - Ver en pantalla
```

### Al eliminar un ticket

```javascript
// Confirmación de borrado
// Se elimina de localStorage
// Se actualiza la lista automáticamente
```

### Al exportar

```javascript
// Se descarga un archivo JSON con todos los tickets
// Puedes compartirlo o hacer backup
```

---

## Integración con Backend

El componente trabaja completamente en frontend con `localStorage`, pero si quieres guardar en backend:

### Opción: Sincronizar con Backend

```jsx
// En TicketsCollection.jsx, modificar al guardar:
useEffect(() => {
  // Sincronizar con backend cada vez que cambie la lista
  const sendToBackend = async () => {
    const collection = getTicketsCollection();
    if (collection.success) {
      await fetch("/api/user/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(collection.tickets),
      });
    }
  };

  sendToBackend();
}, [tickets]); // Ejecutar cuando cambien tickets
```

---

## Troubleshooting

### No aparecen los tickets guardados

```javascript
// Verificar en consola:
const collection = JSON.parse(localStorage.getItem("ticketsCollection"));
console.log("Tickets guardados:", collection);
```

### El componente se ve roto

- Verificar que las variables CSS estén definidas en tu `index.css`:
  - `--morado-primario`
  - `--verde-selva`
  - `--maracuya`
  - `--gris-texto`

### Al enviar ticket, no se guarda automáticamente

- Verificar que `saveTicketToCollection()` se llame correctamente en `TicketModal.jsx`
- Verificar que localStorage esté habilitado

---

## Styling - Variables CSS Requeridas

Para que el componente se vea perfecto, asegúrate de tener estos CSS:

```css
:root {
  --morado-primario: #6366f1;
  --verde-selva: #047857;
  --maracuya: #f97316;
  --gris-texto: #6b7280;
}
```

---

## API Reference

### Funciones disponibles

```javascript
import {
  getTicketsCollection, // Get all tickets
  openTicketFromCollection, // Open in new window
  deleteTicketFromCollection, // Delete one
  exportTicketsCollection, // Export as JSON
} from "../services/ticketService";

// Ejemplo:
const result = getTicketsCollection();
if (result.success) {
  console.log("Total de tickets:", result.total);
  console.log("Tickets:", result.tickets);
}
```

---

¡Listo para integrar! 🎭📚
