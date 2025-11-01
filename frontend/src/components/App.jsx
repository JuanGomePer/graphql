import React, { useState } from "react";
import { ApolloProvider, useQuery, gql } from "@apollo/client";
import client from "./apolloClient";
import FieldSelector from "./FieldSelector";

// Campos disponibles
const breedFields = ["id", "name", "origin", "lifeSpan", "temperament"];
const studentFields = ["id", "firstName", "lastName", "email", "age", "major"];

// 🔹 Construir consulta dinámica para razas
function buildQueryForBreed(selectedFields) {
  const fields = Object.keys(selectedFields).filter((f) => selectedFields[f]);
  if (fields.length === 0) fields.push("id");
  return gql`
    query Breed($id: ID!) {
      breed(id: $id) {
        ${fields.join(" ")}
      }
    }
  `;
}

// 🔹 Construir consulta dinámica para estudiantes
function buildQueryForStudents(selectedFields) {
  const fields = Object.keys(selectedFields).filter((f) => selectedFields[f]);
  if (fields.length === 0) fields.push("id");
  return gql`
    query Students {
      students {
        ${fields.join(" ")}
      }
    }
  `;
}

// ✅ Componente para consultar razas de gatos
function BreedQueryUI() {
  const [selected, setSelected] = useState({
    id: true,
    name: true,
    origin: true,
    lifeSpan: true,
    temperament: true,
  });
  const [id, setId] = useState("abys"); // Cat API IDs like 'abys', 'beng', etc.
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function doQuery() {
    if (!id.trim()) {
      setError(new Error("Ingrese un ID válido (ej: abys, beng, sphy, etc.)"));
      setResult(null);
      return;
    }

    const queryDoc = buildQueryForBreed(selected);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await client.query({
        query: queryDoc,
        variables: { id: id.trim() },
        fetchPolicy: "network-only",
      });
      setResult(res.data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, marginBottom: 12 }}>
      <h3>Consultar raza de gato (por ID)</h3>
      <label>
        ID:{" "}
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Ej: abys, beng, sphy..."
        />
      </label>

      <h4>Campos disponibles</h4>
      <FieldSelector
        options={breedFields}
        selected={selected}
        setSelected={setSelected}
      />

      <button onClick={doQuery} style={{ marginTop: 8 }}>
        Consultar raza
      </button>

      <div style={{ marginTop: 12 }}>
        {loading && <div>Cargando...</div>}
        {error && <div style={{ color: "red" }}>Error: {error.message}</div>}
        {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
      </div>
    </div>
  );
}

// ✅ Componente para consultar estudiantes
function StudentsQueryUI() {
  const [selected, setSelected] = useState({
    firstName: true,
    lastName: true,
    email: true,
  });

  const QUERY = buildQueryForStudents(selected);
  const { data, loading, error } = useQuery(QUERY, { skip: false });

  return (
    <div style={{ border: "1px solid #ddd", padding: 12 }}>
      <h3>Consultar estudiantes (SQLite)</h3>
      <h4>Campos disponibles</h4>
      <FieldSelector
        options={studentFields}
        selected={selected}
        setSelected={setSelected}
      />

      <div style={{ marginTop: 12 }}>
        {loading && <div>Cargando...</div>}
        {error && <div style={{ color: "red" }}>Error: {error.message}</div>}
        {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      </div>
    </div>
  );
}

// 🔸 Componente principal
export default function App() {
  return (
    <ApolloProvider client={client}>
      <div style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
        <h1>Frontend - Apollo + GraphQL</h1>
        <p>Consulta razas de gatos (TheCatAPI) y estudiantes (SQLite).</p>
        <BreedQueryUI />
        <StudentsQueryUI />
      </div>
    </ApolloProvider>
  );
}
