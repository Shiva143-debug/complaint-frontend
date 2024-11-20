// src/components/Resolution.js
import React from 'react';
import { useQuery, gql } from '@apollo/client';

// Define the GraphQL query to fetch resolutions
const GET_RESOLUTIONS = gql`
  query GetResolutions {
    getResolutions {
      id
      resolution_note
      resolvedBy {
        name
        email
      }
      resolved_at
    }
  }
`;

const Resolutions = () => {
  const { loading, error, data } = useQuery(GET_RESOLUTIONS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Resolutions</h1>
      <ul>
        {data.getResolutions.map((resolution) => (
          <li key={resolution.id}>
            <h3>Resolution ID: {resolution.id}</h3>
            <p><strong>Resolved By:</strong> {resolution.resolvedBy.name} ({resolution.resolvedBy.email})</p>
            <p><strong>Resolution Note:</strong> {resolution.resolution_note}</p>
            <p><strong>Resolved At:</strong> {new Date(resolution.resolved_at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Resolutions;
