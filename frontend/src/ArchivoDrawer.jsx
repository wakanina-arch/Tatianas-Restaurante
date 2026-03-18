import React, { useState } from 'react';
import TicketModal from './TicketModal';

// ============================================
// ORDERS LOG DRAWER - ARCHIVO DE REGISTRO
// Sistema de respaldo de tickets emitidos
// ============================================

export default function ArchivoDrawer({ open, onClose, log }) {
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
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.drawer} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>
            <span style={styles.titleIcon}>📋</span>
            Archivo de Tickets
          </h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
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
          >
            <span style={styles.exportIcon}>📥</span>
            Exportar
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
                        {entry.tipo === 'Entrada' && '📥 '}
                        {entry.tipo === 'Salida' && '📤 '}
                        {entry.tipo === 'Sistema' && '⚙️ '}
                        {!['Entrada', 'Salida', 'Sistema'].includes(entry.tipo) && '📄 '}
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
                      <p style={styles.emptyText}>No se encontraron registros</p>
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

        {/* Footer */}
        <div style={styles.footer}>
          <span style={styles.footerIcon}>💾</span>
          <span style={styles.footerText}>
            Los tickets se guardan automáticamente como respaldo
          </span>
        </div>
      </div>

      {/* Modal de ticket */}
      <TicketModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        ticketData={selectedEntry}
      />
    </div>
  );
}

// ============================================
// ESTILOS IPHONE 16
// ============================================
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    zIndex: 2000,
    display: 'flex',
    justifyContent: 'flex-end'
  },
  drawer: {
    width: '700px',
    maxWidth: '90%',
    height: '100%',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    borderLeft: '1px solid rgba(255, 255, 255, 0.5)'
  },
  header: {
    padding: '1.2rem 1.5rem',
    background: 'rgba(255, 255, 255, 0.5)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    margin: 0,
    fontSize: '1.3rem',
    fontWeight: '600',
    color: 'var(--verde-selva)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  titleIcon: {
    fontSize: '1.5rem'
  },
  closeBtn: {
    background: 'rgba(0, 0, 0, 0.05)',
    border: 'none',
    width: '36px',
    height: '36px',
    borderRadius: '18px',
    fontSize: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#666',
    transition: 'all 0.2s ease'
  },
  toolbar: {
    display: 'flex',
    gap: '0.5rem',
    padding: '1rem 1.5rem',
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
    border: '1px solid rgba(0, 0, 0, 0.1)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'all 0.2s ease',
    background: 'rgba(255, 255, 255, 0.8)'
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
    borderRadius: '50%',
    transition: 'all 0.2s ease'
  },
  exportButton: {
    padding: '0.7rem 1.2rem',
    borderRadius: '30px',
    background: 'linear-gradient(135deg, var(--verde-selva) 0%, #2a6b2f 100%)',
    color: 'white',
    border: 'none',
    fontWeight: '600',
    fontSize: '0.9rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(1, 64, 14, 0.2)'
  },
  exportIcon: {
    fontSize: '1rem'
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '0.5rem',
    padding: '0 1.5rem 1rem 1.5rem'
  },
  statItem: {
    textAlign: 'center',
    padding: '0.8rem',
    background: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.5)'
  },
  statValue: {
    display: 'block',
    fontSize: '1.3rem',
    fontWeight: '700',
    color: 'var(--verde-selva)',
    lineHeight: 1.2
  },
  statLabel: {
    fontSize: '0.7rem',
    color: 'var(--gris-texto)',
    fontWeight: '500'
  },
  tableContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '0 1.5rem',
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
    background: 'rgba(255, 255, 255, 0.8)',
    color: 'var(--verde-selva)',
    fontWeight: '600',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  tr: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    transition: 'background 0.2s ease'
  },
  td: {
    padding: '0.8rem 0.5rem',
    verticalAlign: 'middle'
  },
  entradaRow: {
    background: 'rgba(52, 199, 89, 0.03)'
  },
  salidaRow: {
    background: 'rgba(255, 59, 48, 0.03)'
  },
  tipoBadge: {
    display: 'inline-block',
    padding: '0.2rem 0.6rem',
    borderRadius: '30px',
    fontSize: '0.7rem',
    fontWeight: '600'
  },
  entradaBadge: {
    background: 'rgba(52, 199, 89, 0.1)',
    color: '#34c759',
    border: '1px solid rgba(52, 199, 89, 0.2)'
  },
  salidaBadge: {
    background: 'rgba(255, 59, 48, 0.1)',
    color: '#ff3b30',
    border: '1px solid rgba(255, 59, 48, 0.2)'
  },
  sistemaBadge: {
    background: 'rgba(0, 122, 255, 0.1)',
    color: '#007aff',
    border: '1px solid rgba(0, 122, 255, 0.2)'
  },
  pedidoId: {
    fontWeight: '600',
    color: 'var(--verde-selva)'
  },
  hora: {
    color: 'var(--gris-texto)',
    fontSize: '0.75rem'
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
    borderRadius: '20px',
    transition: 'all 0.2s ease',
    opacity: 0.7
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
  emptyText: {
    margin: 0,
    color: 'var(--gris-texto)',
    fontSize: '0.9rem'
  },
  clearFilterBtn: {
    background: 'rgba(255, 255, 255, 0.5)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    padding: '0.3rem 1rem',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    transition: 'all 0.2s ease'
  },
  footer: {
    padding: '1rem 1.5rem',
    background: 'rgba(255, 255, 255, 0.5)',
    borderTop: '1px solid rgba(0, 0, 0, 0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem',
    color: 'var(--gris-texto)'
  },
  footerIcon: {
    fontSize: '1rem'
  },
  footerText: {
    fontStyle: 'italic',
    opacity: 0.7
  }
};

// ============================================
// ESTILOS DINÁMICOS (se añaden al final)
// ============================================
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .close-btn:hover {
    background: rgba(0, 0, 0, 0.1) !important;
  }

  .search-input:focus {
    border-color: var(--maracuya) !important;
    box-shadow: 0 0 0 3px rgba(255, 179, 71, 0.1) !important;
  }

  .clear-filter:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .export-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(1, 64, 14, 0.3) !important;
  }

  tr:hover {
    background: rgba(255, 255, 255, 0.5) !important;
  }

  .ticket-button:hover {
    background: rgba(255, 179, 71, 0.1) !important;
    opacity: 1 !important;
    transform: scale(1.1);
  }

  .clear-filter-btn:hover {
    background: var(--maracuya) !important;
    color: white !important;
    border-color: var(--maracuya) !important;
  }

  /* Scrollbar personalizado */
  .table-container::-webkit-scrollbar {
    width: 6px;
  }

  .table-container::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 3px;
  }

  .table-container::-webkit-scrollbar-thumb {
    background: var(--maracuya);
    border-radius: 3px;
  }

  .table-container::-webkit-scrollbar-thumb:hover {
    background: var(--verde-selva);
  }
`;

// Añadir estilos al documento
if (typeof document !== 'undefined') {
  document.head.appendChild(styleSheet);
}