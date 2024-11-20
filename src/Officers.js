// src/components/Officers.js
import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Table } from 'react-bootstrap';

const GET_OFFICERS = gql`
  query {
    getOfficers {
      id
      name
      email
      phone
    }
  }
`;

const Officers = () => {
  const { loading, error, data } = useQuery(GET_OFFICERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Officers</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {data.getOfficers.map((officer) => (
            <tr key={officer.id}>
              <td>{officer.id}</td>
              <td>{officer.name}</td>
              <td>{officer.email}</td>
              <td>{officer.phone}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Officers;
