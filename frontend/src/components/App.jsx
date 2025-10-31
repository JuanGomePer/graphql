import React, { useState } from 'react';
import { ApolloProvider, useQuery, gql } from '@apollo/client';
import client from './apolloClient';          
import FieldSelector from './FieldSelector';  


const breedFields = ['id','name','origin','lifeSpan','temperament'];
const studentFields = ['id','firstName','lastName','email','age','major'];

// 🔹 Construir consulta dinámica para razas
function buildQueryForBreed(selectedFields){
  const fields = Object.keys(selectedFields).filter(f => selectedFields[f]);
  if(fields.length === 0) fields.push('id');
  return gql`query Breed($id: ID!){ breed(id: $id){ ${fields.join(' ')} } }`;
}

// 🔹 Construir consulta dinámica para estudiantes
function buildQueryForStudents(selectedFields){
  const fields = Object.keys(selectedFields).filter(f => selectedFields[f]);
  if(fields.length === 0) fields.push('id');
  return gql`query Students{ students{ ${fields.join(' ')} } }`;
}

// ✅ Componente para consultar raza de gato
function BreedQueryUI() {
  const [selected, setSelected] = useState({ name: true, origin: true, lifeSpan: true, temperament: true, id: true });
  const [id, setId] = useState('1');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // construye la query dinámicamente según selected
  function buildQuery(selectedFields) {
    const fields = Object.keys(selectedFields).filter(f => selectedFields[f]);
    if (fields.length === 0) fields.push('id');
    // devolver un documento gql
    return gql`query Breed($id: ID!){ breed(id: $id){ ${fields.join(' ')} } }`;
  }

  async function doQuery() {
    // validación simple del id (evita enviar vacío)
    if (!id || id.toString().trim() === '') {
      setError(new Error('Ingrese un ID válido'));
      setResult(null);
      return;
    }

    const queryDoc = buildQuery(selected);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // usa client.query para ejecutar la query sólo ahora
      const res = await client.query({
        query: queryDoc,
        variables: { id: id.toString() },
        fetchPolicy: 'network-only' // forzar llamada al servidor
      });
      setResult(res.data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, marginBottom: 12 }}>
      <h3>Consultar raza (por ID)</h3>
      <label>ID: <input value={id} onChange={e => setId(e.target.value)} /></label>

      <h4>Campos disponibles</h4>
      {/* Reusa tu FieldSelector existente */}
      <FieldSelector options={['id','name','origin','lifeSpan','temperament']} selected={selected} setSelected={setSelected} />

      <button onClick={doQuery} style={{ marginTop: 8 }}>Consultar raza</button>

      <div style={{ marginTop: 12 }}>
        {loading && <div>Cargando...</div>}
        {error && <div style={{ color: 'red' }}>Error: {error.message}</div>}
        {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
      </div>
    </div>
  );
}

// ✅ Componente para consultar estudiantes
function StudentsQueryUI(){
  const [selected, setSelected] = useState({ firstName: true, lastName: true, email: true });
  const QUERY = buildQueryForStudents(selected);
  const { data, loading, error } = useQuery(QUERY, { skip: false });

  return (
    <div style={{ border: '1px solid #ddd', padding: 12 }}>
      <h3>Consultar estudiantes (todos)</h3>
      <h4>Campos disponibles</h4>
      <FieldSelector options={studentFields} selected={selected} setSelected={setSelected} />

      <div style={{ marginTop: 12 }}>
        {loading && <div>Cargando...</div>}
        {error && <div style={{ color: 'red' }}>Error: {error.message}</div>}
        {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      </div>
    </div>
  );
}

// 🔸 Componente principal
export default function App(){
  return (
    <ApolloProvider client={client}>
      <div style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
        <h1>Frontend - Apollo + GraphQL</h1>
        <p>Selecciona campos y realiza consultas.</p>
        <BreedQueryUI />
        <StudentsQueryUI />
      </div>
    </ApolloProvider>
  );
}
