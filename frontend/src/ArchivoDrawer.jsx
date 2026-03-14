import React, { useState } from 'react';
import TicketModal from './TicketModal'; // Importamos el modal que no debemos modificar

// ============================================
// ORDERS LOG DRAWER - ARCHIVO DE REGISTRO
// Sistema de respaldo de tickets emitidos
// ============================================

export default function ArchivoDrawer({ open, onClose, log 
}) 
{
  const [filter, setFilter] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  if (!open) return null;

  // Asegurar que log sea un array
  const safeLog = Array.isArray(log) ? log : [];

  // ============================================
  // FILTRADO DE REGISTROS
  // ============================================
  const filteredLog = safeLog.filter(entry => {
    const searchTerm = filter.toLowerCase();
    return (
      entry.pedido?.toLowerCase().includes(searchTerm) ||
      entry.usuario?.toLowerCase().includes(searchTerm) ||
      entry.tipo?.toLowerCase().includes(searchTerm) ||
      entry.detalle?.toLowerCase().includes(searchTerm)
    );
  });

  // ============================================
  // FUNCIÓN PARA ABRIR TICKET
  // ============================================
  const handleViewTicket = (entry) => {
    setSelectedEntry(entry);
    setModalOpen(true);
  };

  // ============================================
  // FUNCIÓN PARA EXPORTAR LOG
  // ============================================
  const handleExportLog = () => {
    const texto = safeLog.map(entry => 
      `[${entry.hora}] ${entry.tipo} | Pedido: ${entry.pedido} | Cliente: ${entry.usuario} | ${entry.detalle}`
    ).join('\n');

    const fecha = new Date().toISOString().slice(0, 10);
    const blob = new Blob([texto], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `registro_ventas_${fecha}.txt`;
    link.click();
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer" onClick={e => e.stopPropagation()}>
        
        {/* Header con estilo unificado */}
        <div className="drawer-header">
          <h2>📋 Archivo de Tickets</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Barra de herramientas */}
        <div style={styles.toolbar}>
          <div style={styles.searchContainer}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Buscar por pedido, cliente o detalle..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={styles.searchInput}
            />
            {filter && (
              <button
                style={styles.clearFilter}
                onClick={() => setFilter('')}
                aria-label="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>
          
          <button
            onClick={handleExportLog}
            style={styles.exportButton}
            className="admin-btn"
            title="Exportar registro completo"
          >
            📥 Exportar
          </button>
        </div>

        {/* Estadísticas rápidas */}
        <div style={styles.statsContainer}>
          <div style={styles.statItem}>
            <span style={styles.statValue}>{safeLog.length}</span>
            <span style={styles.statLabel}>Total tickets</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statValue}>
              {safeLog.filter(e => e.tipo === 'Entrada').length}
            </span>
            <span style={styles.statLabel}>Entradas</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statValue}>
              {safeLog.filter(e => e.tipo === 'Salida').length}
            </span>
            <span style={styles.statLabel}>Salidas</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statValue}>{filteredLog.length}</span>
            <span style={styles.statLabel}>Filtrados</span>
          </div>
        </div>

        {/* Tabla de registros */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Tipo</th>
                <th style={styles.th}>Pedido</th>
                <th style={styles.th}>Cliente</th>
                <th style={styles.th}>Hora</th>
                <th style={styles.th}>Detalle</th>
                <th style={styles.th}>Ticket</th>
              </tr>
            </thead>
            <tbody>
              {filteredLog.length > 0 ? (
                filteredLog.map((entry, idx) => (
                  <tr 
                    key={entry.id || idx} 
                    style={{
                      ...styles.tr,
                      ...(entry.tipo === 'Entrada' ? styles.entradaRow : {}),
                      ...(entry.tipo === 'Salida' ? styles.salidaRow : {})
                    }}
                  >
                    <td style={styles.td}>
                      <span style={{
                        ...styles.tipoBadge,
                        ...(entry.tipo === 'Entrada' ? styles.entradaBadge : {}),
                        ...(entry.tipo === 'Salida' ? styles.salidaBadge : {}),
                        ...(entry.tipo === 'Sistema' ? styles.sistemaBadge : {})
                      }}>
                        {entry.tipo === 'Entrada' && '📥'}
                        {entry.tipo === 'Salida' && '📤'}
                        {entry.tipo === 'Sistema' && '⚙️'}
                        {!['Entrada', 'Salida', 'Sistema'].includes(entry.tipo) && '📄'}
                        {entry.tipo}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.pedidoId}>#{entry.pedido}</span>
                    </td>
                    <td style={styles.td}>{entry.usuario}</td>
                    <td style={styles.td}>
                      <span style={styles.hora}>{entry.hora}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.detalle}>{entry.detalle}</span>
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => handleViewTicket(entry)}
                        style={styles.ticketButton}
                        title="Ver ticket original"
                      >
                        🧾
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={styles.emptyState}>
                    <div style={styles.emptyContent}>
                      <span style={styles.emptyIcon}>🔍</span>
                      <p>No se encontraron registros</p>
                      {filter && (
                        <button
                          onClick={() => setFilter('')}
                          style={styles.clearFilterBtn}
                        >
                          Limpiar filtro
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer con información adicional */}
        <div style={styles.footer}>
          <span style={styles.footerIcon}>💾</span>
          <span style={styles.footerText}>
            Los tickets se guardan automáticamente como respaldo
          </span>
        </div>
      </div>

      {/* Modal de ticket (sin modificar) */}
      <TicketModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        ticketData={selectedEntry}
      />
    </div>
  );
}

// ============================================
// ESTILOS INTEGRADOS CON VARIABLES CSS
// ============================================
const styles = {
  toolbar: {
    display: 'flex',
    gap: '0.5rem',
    padding: '1rem',
    background: 'var(--crema-tropical)',
    borderBottom: '2px solid var(--borde-tropical)',
    alignItems: 'center'
  },

  searchContainer: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },

  searchIcon: {
    position: 'absolute',
    left: '12px',
    fontSize: '1rem',
    opacity: 0.5,
    zIndex: 1
  },

  searchInput: {
    width: '100%',
    padding: '0.7rem 0.7rem 0.7rem 35px',
    borderRadius: '30px',
    border: '2px solid var(--borde-tropical)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'all 0.3s ease'
  },

  clearFilter: {
    position: 'absolute',
    right: '10px',
    background: 'none',
    border: 'none',
    color: '#999',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: '4px 8px',
    borderRadius: '50%'
  },

  exportButton: {
    padding: '0.7rem 1.2rem',
    borderRadius: '30px',
    background: 'linear-gradient(135deg, var(--verde-selva) 0%, #296b35 100%)',
    color: 'white',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },

  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '0.5rem',
    padding: '1rem',
    background: 'white'
  },

  statItem: {
    textAlign: 'center',
    padding: '0.5rem',
    background: 'var(--crema-tropical)',
    borderRadius: '12px',
    border: '1px solid var(--borde-tropical)'
  },

  statValue: {
    display: 'block',
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: 'var(--verde-selva)'
  },

  statLabel: {
    fontSize: '0.7rem',
    color: 'var(--gris-secundario)'
  },

  tableContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '0 1rem 1rem 1rem',
    maxHeight: '400px'
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.85rem'
  },

  th: {
    textAlign: 'left',
    padding: '0.8rem 0.5rem',
    background: 'linear-gradient(135deg, var(--mango) 0%, var(--maracuya) 100%)',
    color: 'var(--verde-selva)',
    fontWeight: '600',
    position: 'sticky',
    top: 0,
    zIndex: 10
  },

  tr: {
    borderBottom: '1px solid var(--borde-tropical)',
    transition: 'background 0.3s ease'
  },

  td: {
    padding: '0.8rem 0.5rem',
    verticalAlign: 'middle'
  },

  entradaRow: {
    background: 'rgba(46, 204, 113, 0.05)'
  },

  salidaRow: {
    background: 'rgba(231, 76, 60, 0.05)'
  },

  tipoBadge: {
    display: 'inline-block',
    padding: '0.2rem 0.5rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600'
  },

  entradaBadge: {
    background: 'rgba(46, 204, 113, 0.2)',
    color: '#27ae60',
    border: '1px solid #27ae60'
  },

  salidaBadge: {
    background: 'rgba(231, 76, 60, 0.2)',
    color: '#c0392b',
    border: '1px solid #c0392b'
  },

  sistemaBadge: {
    background: 'rgba(52, 152, 219, 0.2)',
    color: '#2980b9',
    border: '1px solid #2980b9'
  },

  pedidoId: {
    fontWeight: '600',
    color: 'var(--verde-selva)'
  },

  hora: {
    color: 'var(--gris-secundario)',
    fontSize: '0.8rem'
  },

  detalle: {
    color: 'var(--gris-texto)',
    fontSize: '0.8rem'
  },

  ticketButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '50%',
    transition: 'all 0.3s ease'
  },

  emptyState: {
    textAlign: 'center',
    padding: '3rem 1rem',
    color: '#aaa'
  },

  emptyContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem'
  },

  emptyIcon: {
    fontSize: '2rem',
    opacity: 0.3
  },

  clearFilterBtn: {
    background: 'var(--crema-tropical)',
    border: '2px solid var(--borde-tropical)',
    padding: '0.3rem 1rem',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.8rem'
  },

  footer: {
    marginTop: 'auto',
    padding: '1rem',
    background: 'var(--crema-tropical)',
    borderTop: '2px solid var(--borde-tropical)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem',
    color: 'var(--gris-secundario)'
  },

  footerIcon: {
    fontSize: '1rem'
  },

  footerText: {
    fontStyle: 'italic'
  }
};

// ============================================
// ESTILOS DINÁMICOS
// ============================================
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .orders-log-table tr:hover {
    background: var(--crema-tropical) !important;
    cursor: pointer;
  }

  .ticket-button:hover {
    background: var(--mango);
    transform: scale(1.1);
  }

  .search-input:focus {
    border-color: var(--maracuya) !important;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
  }

  .clear-filter:hover {
    background: rgba(0,0,0,0.05);
  }

  .export-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(1, 64, 14, 0.3);
  }

  .clear-filter-btn:hover {
    background: var(--maracuya);
    color: white;
    border-color: var(--maracuya);
  }

  /* Scrollbar personalizado */
  .table-container::-webkit-scrollbar {
    width: 6px;
  }

  .table-container::-webkit-scrollbar-track {
    background: var(--borde-tropical);
    border-radius: 10px;
  }

  .table-container::-webkit-scrollbar-thumb {
    background: var(--maracuya);
    border-radius: 10px;
  }

  .table-container::-webkit-scrollbar-thumb:hover {
    background: var(--verde-selva);
  }
`;
document.head.appendChild(styleSheet);
