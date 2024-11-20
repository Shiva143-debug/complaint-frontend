// src/components/AuditLog.js
import React from 'react';
import { useQuery, gql } from '@apollo/client';

// Define the GraphQL query to fetch audit logs
const GET_AUDIT_LOGS = gql`
  query GetAuditLogs {
    getAuditLogs {
      id
      action
      performedBy {
        name
        email
      }
      timestamp
      details
    }
  }
`;

const AuditLogs = () => {
  const { loading, error, data } = useQuery(GET_AUDIT_LOGS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Audit Logs</h1>
      <ul>
        {data.getAuditLogs.map((log) => (
          <li key={log.id}>
            <h3>Audit Log ID: {log.id}</h3>
            <p><strong>Action:</strong> {log.action}</p>
            <p><strong>Performed By:</strong> {log.performedBy.name} ({log.performedBy.email})</p>
            <p><strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}</p>
            <p><strong>Details:</strong> {log.details}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuditLogs;
