import React, { useState } from 'react';

export default function EditMenuDrawer({ open, onClose, menuItems, onSave }) {
  const [items, setItems] = useState(menuItems);
  const [saving, setSaving] = useState(false);

  // Previsualización inteligente
  const renderPreview = (url) => {
    if (!url) return <div style={{height:'80px', background:'#f0f0f0', borderRadius:'8px', border:'1px dashed #ccc', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', color:'#999', marginTop:'5px'}}>Esperando Multimedia...</div>;
    const isVideo = /\.(mp4|webm|mov|ogg)$/i.test(url);
    
    return (
      <div style={{ margin: '8px 0' }}>
        {isVideo ? (
          <video src={url} muted style={{ width: '100%', height:'100px', objectFit:'cover', borderRadius: '8px', border:'2px solid #764ba2' }} />
        ) : (
          <img src={url} alt="Preview" style={{ width: '100%', height:'100px', objectFit:'cover', borderRadius: '8px', border:'1px solid #ddd' }} />
        )}
      </div>
    );
  };

  const handleCategoryChange = (idx, field, value) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [field]: value };
    setItems(updated);
  };

  const handleOptionChange = (itemIdx, optIdx, field, value) => {
    const updated = [...items];
    updated[itemIdx].opciones[optIdx] = {
      ...updated[itemIdx].opciones[optIdx],
      [field]: value
    };
    setItems(updated);
  };

  if (!open) return null;

  return (
    <div className="drawer-backdrop" style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.6)', zIndex:3000, display:'flex', justifyContent:'flex-end', backdropFilter:'blur(4px)'}}>
      <div className="drawer" style={{width:'420px', background:'white', height:'100%', padding:'2rem', overflowY:'auto', boxShadow:'-10px 0 30px rgba(0,0,0,0.2)'}}>
        
        {/* CABECERA CON EL ICONO QUE TE GUSTA */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2.5rem', borderBottom:'1px solid #eee', paddingBottom:'1rem'}}>
          <h2 style={{color:'#764ba2', margin:0, fontSize:'1.5rem'}}>⚙️ Ajustes del Menú</h2>
          <button onClick={onClose} style={{cursor:'pointer', border:'none', background:'#f5f5f5', width:'35px', height:'35px', borderRadius:'50%', fontSize:'1rem', color:'#666', display:'flex', alignItems:'center', justifyContent:'center'}}>✕</button>
        </div>

        <form onSubmit={e => { e.preventDefault(); onSave(items); onClose(); }}>
          {items.map((item, idx) => (
            <div key={item.id} style={{marginBottom:'3rem', padding:'1rem', border:'1px solid #f0f0f0', borderRadius:'15px', position:'relative'}}>
              
              {/* TÍTULO DE CATEGORÍA EDITABLE */}
              <span style={{position:'absolute', top:'-12px', left:'20px', background:'white', padding:'0 10px', color:'#764ba2', fontWeight:'800', fontSize:'0.9rem', textTransform:'uppercase'}}>Categoría</span>
              
              <input 
                style={{display:'block', width:'100%', padding:'12px', fontSize:'1.2rem', fontWeight:'bold', marginBottom:'1.5rem', borderRadius:'10px', border:'2px solid #764ba2', color:'#333', outline:'none'}}
                value={item.nombre} 
                onChange={e => handleCategoryChange(idx, 'nombre', e.target.value)} 
                placeholder="Ej: Primero"
              />

              {/* OPCIONES 1, 2, 3 */}
              {item.opciones.map((opt, oidx) => (
                <div key={oidx} style={{marginBottom:'2rem', padding:'1rem', borderLeft:'3px solid #764ba2', background:'#fcfcfc', borderRadius:'0 10px 10px 0'}}>
                  <p style={{fontWeight:'700', color:'#444', margin:'0 0 10px 0', fontSize:'0.95rem'}}>Opción {oidx + 1}</p>
                  
                  <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                    <label style={{fontSize:'0.85rem', color:'#666'}}>Nombre del plato:
                      <input 
                        style={{width:'100%', padding:'8px', borderRadius:'6px', border:'1px solid #ddd', marginTop:'4px'}}
                        value={opt.nombre} 
                        onChange={e => handleOptionChange(idx, oidx, 'nombre', e.target.value)} 
                      />
                    </label>

                    <label style={{fontSize:'0.85rem', color:'#666'}}>Precio Sugerido ($):
                      <input 
                        type="number" 
                        step="0.1"
                        style={{width:'100%', padding:'8px', borderRadius:'6px', border:'1px solid #ddd', marginTop:'4px'}}
                        value={opt.precio || item.precio} 
                        onChange={e => handleOptionChange(idx, oidx, 'precio', parseFloat(e.target.value))} 
                      />
                    </label>

                    <label style={{fontSize:'0.85rem', color:'#666'}}>URL Multimedia (Foto/Video):
                      <input 
                        style={{width:'100%', padding:'8px', borderRadius:'6px', border:'1px solid #ddd', marginTop:'4px'}}
                        value={opt.imagen || ''} 
                        onChange={e => handleOptionChange(idx, oidx, 'imagen', e.target.value)} 
                        placeholder="Pega el enlace aquí"
                      />
                    </label>
                    
                    {renderPreview(opt.imagen)}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* BOTÓN DE GUARDADO FINAL */}
          <button type="submit" style={{width:'100%', padding:'18px', background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color:'white', border:'none', borderRadius:'15px', fontWeight:'800', fontSize:'1.1rem', cursor:'pointer', boxShadow:'0 10px 20px rgba(118, 75, 162, 0.3)', marginTop:'1rem'}}>
            🚀 Publicar Menú del Día
          </button>
        </form>
      </div>
    </div>
  );
}
