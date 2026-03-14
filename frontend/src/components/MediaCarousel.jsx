import React, { useState } from 'react';

export default function MediaCarousel({ items }) {
  const [index, setIndex] = useState(0);

  if (!items || items.length === 0) return null;

  return (
    <div style={{ position: 'relative', height: '100%', background: '#333' }}>
      <img 
        src={items[index].url}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <button onClick={() => setIndex(i => (i - 1 + items.length) % items.length)}
        style={{ position: 'absolute', left: 10, top: '50%' }}>‹</button>
      <button onClick={() => setIndex(i => (i + 1) % items.length)}
        style={{ position: 'absolute', right: 10, top: '50%' }}>›</button>
    </div>
  );
}