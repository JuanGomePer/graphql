import React from 'react';


export default function FieldSelector({ options, selected, setSelected }){
function toggle(field){
const next = { ...selected };
next[field] = !next[field];
setSelected(next);
}


return (
<div>
{options.map(opt => (
<label key={opt} style={{ display: 'block', margin: '4px 0' }}>
<input type="checkbox" checked={!!selected[opt]} onChange={() => toggle(opt)} /> {opt}
</label>
))}
</div>
);
}