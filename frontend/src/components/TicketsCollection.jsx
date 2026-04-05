import { useState, useEffect } from 'react';
import {
  getTicketsCollection,
  openTicketFromCollection,
  deleteTicketFromCollection,
  exportTicketsCollection
} from '../services/ticketService';

export default function TicketsCollection() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = () => {
    setLoading(true);
    const result = getTicketsCollection();
    if (result.success) {
      // Ordenar por más recientes primero
      const sorted = [...result.tickets].sort(
        (a, b) => new Date(b.savedAt) - new Date(a.savedAt)
      );
      setTickets(sorted);
    }
    setLoading(false);
  };

  const handleDelete = (ticketId) => {
    if (confirm('¿Estás seguro de que deseas eliminar este ticket?')) {
      const result = deleteTicketFromCollection(ticketId);
      if (result.success) {
        setTickets(tickets.filter(t => t.id !== ticketId));
        alert(`✅ Ticket eliminado. Quedan ${result.totalRemaining} tickets.`);
      }
    }
  };

  const handleOpen = (ticketId) => {
    const result = openTicketFromCollection(ticketId);
    if (!result.success) {
      alert('❌ Error abriendo el ticket');
    }
  };

  const handleExport = () => {
    const result = exportTicketsCollection();
    if (result.success) {
      alert('✅ Colección exportada como JSON');
    } else {
      alert('❌ Error exportando colección');
    }
  };

  if (loading) {
    return <div style={styles.container}>⏳ Cargando...</div>;
  }

  if (tickets.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.empty}>
          <p style={styles.emptyIcon}>📚</p>
          <p style={styles.emptyText}>Aún no tienes tickets guardados</p>
          <p style={styles.emptySubtext}>Los tickets se guardarán automáticamente cuando los envíes</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>📚 Mi Colección de Oráculos</h2>
        <button style={styles.exportBtn} onClick={handleExport}>
          💾 Exportar Todo
        </button>
      </div>

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <span style={styles.statNumber}>{tickets.length}</span>
          <span style={styles.statLabel}>Tickets</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statNumber}>
            ${tickets.reduce((sum, t) => sum + (t.total || 0), 0).toFixed(2)}
          </span>
          <span style={styles.statLabel}>Gasto Total</span>
        </div>
      </div>

      <div style={styles.ticketsList}>
        {tickets.map((ticket) => (
          <div key={ticket.id} style={styles.ticketCard}>
            <div
              style={styles.ticketHeader}
              onClick={() => setExpandedId(expandedId === ticket.id ? null : ticket.id)}
            >
              <div style={styles.ticketInfo}>
                <span style={styles.ticketNumber}>
                  #{ticket.orderNumber || 'OTO-001'}
                </span>
                <span style={styles.ticketDate}>
                  {new Date(ticket.savedAt).toLocaleDateString('es-ES')}
                </span>
              </div>
              <span style={styles.ticketAmount}>
                ${ticket.total?.toFixed(2) || '0.00'}
              </span>
              <span style={styles.expandIcon}>
                {expandedId === ticket.id ? '▼' : '▶'}
              </span>
            </div>

            {expandedId === ticket.id && (
              <div style={styles.ticketDetails}>
                {/* Items */}
                {ticket.items && ticket.items.length > 0 && (
                  <div style={styles.itemsSection}>
                    <h4 style={styles.sectionTitle}>Artículos:</h4>
                    <div style={styles.itemsList}>
                      {ticket.items.map((item, idx) => (
                        <div key={idx} style={styles.detailItem}>
                          <span>{item.cantidad}x {item.nombre}</span>
                          <span>${item.precio?.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Frase - Oráculo */}
                {ticket.frase && ticket.frase.texto && (
                  <div style={styles.oracleSection}>
                    <div style={styles.oracleIcon}>{ticket.frase.icono || '🌟'}</div>
                    <p style={styles.oracleText}>"{ticket.frase.texto}"</p>
                  </div>
                )}

                {/* Acciones */}
                <div style={styles.actions}>
                  <button
                    style={styles.actionBtn}
                    onClick={() => handleOpen(ticket.id)}
                  >
                    👁️ Ver Completo
                  </button>
                  <button
                    style={{ ...styles.actionBtn, background: '#ff3b30' }}
                    onClick={() => handleDelete(ticket.id)}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '1rem',
    fontFamily: 'inherit'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  title: {
    margin: 0,
    fontSize: '1.3rem',
    fontWeight: '700',
    color: 'var(--verde-selva)'
  },
  exportBtn: {
    padding: '0.5rem 1rem',
    background: 'linear-gradient(135deg, #FFD700 0%, #FFC700 100%)',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.85rem',
    transition: 'all 0.2s ease'
  },
  stats: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  statCard: {
    flex: 1,
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
    padding: '1rem',
    borderRadius: '16px',
    textAlign: 'center',
    border: '1px solid rgba(99, 102, 241, 0.2)'
  },
  statNumber: {
    display: 'block',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--morado-primario)',
    marginBottom: '0.25rem'
  },
  statLabel: {
    fontSize: '0.75rem',
    color: 'var(--gris-texto)',
    fontWeight: '500'
  },
  ticketsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem'
  },
  ticketCard: {
    background: 'white',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '16px',
    overflow: 'hidden',
    transition: 'all 0.2s ease'
  },
  ticketHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    cursor: 'pointer',
    background: 'rgba(255, 255, 255, 0.5)',
    transition: 'background 0.2s ease'
  },
  ticketInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  ticketNumber: {
    fontWeight: '700',
    fontSize: '0.95rem',
    color: 'var(--morado-primario)'
  },
  ticketDate: {
    fontSize: '0.75rem',
    color: 'var(--gris-texto)'
  },
  ticketAmount: {
    fontWeight: '700',
    fontSize: '1rem',
    color: 'var(--maracuya)',
    marginRight: '1rem'
  },
  expandIcon: {
    color: 'var(--gris-texto)',
    fontSize: '0.8rem'
  },
  ticketDetails: {
    padding: '1rem',
    borderTop: '1px solid rgba(0, 0, 0, 0.05)',
    background: 'rgba(0, 0, 0, 0.02)'
  },
  itemsSection: {
    marginBottom: '1rem'
  },
  sectionTitle: {
    margin: '0 0 0.5rem 0',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--verde-selva)'
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    padding: '0.4rem 0',
    borderBottom: '1px solid rgba(0, 0, 0, 0.03)'
  },
  oracleSection: {
    background: 'linear-gradient(135deg, #fdf2e9, #fff5f5)',
    padding: '0.8rem',
    borderRadius: '12px',
    border: '1px solid #FFD700',
    textAlign: 'center',
    marginBottom: '1rem'
  },
  oracleIcon: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
    display: 'block'
  },
  oracleText: {
    margin: 0,
    fontSize: '0.8rem',
    color: '#8B0000',
    fontStyle: 'italic',
    lineHeight: '1.4'
  },
  actions: {
    display: 'flex',
    gap: '0.6rem'
  },
  actionBtn: {
    flex: 1,
    padding: '0.6rem',
    background: 'linear-gradient(135deg, var(--morado-primario) 0%, #8b5cf6 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.8rem',
    transition: 'all 0.2s ease'
  },
  empty: {
    textAlign: 'center',
    padding: '3rem 1rem',
    color: 'var(--gris-texto)'
  },
  emptyIcon: {
    fontSize: '3rem',
    margin: 0
  },
  emptyText: {
    fontSize: '1rem',
    fontWeight: '600',
    margin: '1rem 0 0.5rem 0'
  },
  emptySubtext: {
    fontSize: '0.85rem',
    margin: 0,
    opacity: 0.7
  }
};
