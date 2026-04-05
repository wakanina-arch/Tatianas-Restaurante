/**
 * Servicio de Tickets - Captura, genera y envía tickets completos
 */

/**
 * Captura el ticket como HTML y imagen
 */
export async function captureTicketAsHTML() {
  try {
    const ticketElement = document.querySelector('.ticket-content');
    if (!ticketElement) throw new Error('No se pudo encontrar el ticket');

    // Clonar el ticket para modificarlo sin afectar el original
    const ticketClone = ticketElement.cloneNode(true);

    // Obtener el canvas del QR
    const qrCanvas = document.querySelector('#ticket-qr canvas');
    let qrImageData = '';

    if (qrCanvas) {
      qrImageData = qrCanvas.toDataURL('image/png');
      // Reemplazar el QR en el clon con la imagen
      const qrContainer = ticketClone.querySelector('#ticket-qr');
      if (qrContainer) {
        qrContainer.innerHTML = `<img src="${qrImageData}" style="width: 100px; height: 100px; border-radius: 12px;" />`;
      }
    }

    // Obtener todos los estilos
    const estilos = Array.from(document.querySelectorAll('style'))
      .map(style => style.innerHTML)
      .join('\n');

    // Remover botón de descarga del clon (no queremos que aparezca en email/impresión)
    const printContainer = ticketClone.querySelector('div[style*="position: absolute"]');
    if (printContainer) printContainer.remove();

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ticket del Pedido</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          }

          .ticket-content {
            max-width: 400px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 32px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 24px;
            animation: slideUp 0.3s ease-out;
          }

          @keyframes slideUp {
            from {
              transform: translateY(20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          @keyframes pulso {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); opacity: 0.8; }
          }

          /* Variables CSS */
          :root {
            --morado-primario: #6366f1;
            --verde-selva: #047857;
            --maracuya: #f97316;
            --gris-texto: #6b7280;
          }

          ${estilos}
        </style>
      </head>
      <body>
        ${ticketClone.outerHTML}
        
        <script>
          // Detectar si se abrió desde mobile para mostrar información
          if (window.innerWidth < 768) {
            console.log('📱 Ticket abierto en dispositivo móvil');
          }
        </script>
      </body>
      </html>
    `;

    return {
      html: htmlContent,
      qrImage: qrImageData,
      success: true
    };
  } catch (error) {
    console.error('Error capturando ticket:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Descarga el ticket como archivo HTML
 */
export function downloadTicketHTML(htmlContent, orderNumber) {
  try {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ticket_${orderNumber || 'OTO-001'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error descargando ticket:', error);
    return false;
  }
}

/**
 * Envía el ticket por email y WhatsApp
 */
export async function sendTicketViaChannels(order, ticketHTML, userEmail, userPhone) {
  try {
    const response = await fetch('/api/tickets/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order: {
          numero: order.numero || order.ordenId,
          total: order.total,
          items: order.items || []
        },
        ticketHTML,
        userEmail,
        userPhone,
        timestamp: new Date().toISOString()
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error enviando el ticket');
    }

    return {
      success: true,
      emailSent: data.emailSent,
      whatsappSent: data.whatsappSent,
      message: data.message
    };
  } catch (error) {
    console.error('Error enviando ticket:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Guarda el ticket en la colección local (localStorage)
 */
export function saveTicketToCollection(order, htmlContent) {
  try {
    let collection = JSON.parse(localStorage.getItem('ticketsCollection') || '[]');

    const ticketData = {
      id: `TICKET-${Date.now()}`,
      orderNumber: order.numero || order.ordenId,
      total: order.total,
      items: order.items || [],
      htmlContent: htmlContent,
      savedAt: new Date().toISOString(),
      frase: JSON.parse(localStorage.getItem('fraseOraculo') || '{objeto vacio}')
    };

    collection.push(ticketData);
    localStorage.setItem('ticketsCollection', JSON.stringify(collection));

    return {
      success: true,
      ticketId: ticketData.id,
      totalSaved: collection.length
    };
  } catch (error) {
    console.error('Error guardando ticket:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Obtiene todos los tickets guardados
 */
export function getTicketsCollection() {
  try {
    const collection = JSON.parse(localStorage.getItem('ticketsCollection') || '[]');
    return {
      success: true,
      tickets: collection,
      total: collection.length
    };
  } catch (error) {
    console.error('Error obteniendo colección:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Abre un ticket guardado
 */
export function openTicketFromCollection(ticketId) {
  try {
    const collection = JSON.parse(localStorage.getItem('ticketsCollection') || '[]');
    const ticket = collection.find(t => t.id === ticketId);

    if (!ticket) throw new Error('Ticket no encontrado');

    // Abrir en pestaña nueva
    const newWindow = window.open();
    newWindow.document.write(ticket.htmlContent);
    newWindow.document.close();

    return { success: true };
  } catch (error) {
    console.error('Error abriendo ticket:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Elimina un ticket de la colección
 */
export function deleteTicketFromCollection(ticketId) {
  try {
    let collection = JSON.parse(localStorage.getItem('ticketsCollection') || '[]');
    collection = collection.filter(t => t.id !== ticketId);
    localStorage.setItem('ticketsCollection', JSON.stringify(collection));

    return {
      success: true,
      totalRemaining: collection.length
    };
  } catch (error) {
    console.error('Error eliminando ticket:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Exporta la colección de tickets como archivo JSON
 */
export function exportTicketsCollection() {
  try {
    const collection = JSON.parse(localStorage.getItem('ticketsCollection') || '[]');
    const blob = new Blob([JSON.stringify(collection, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tickets_collection_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error('Error exportando colección:', error);
    return { success: false, error: error.message };
  }
}
