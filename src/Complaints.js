// src/components/Complaints.js
import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Table } from 'react-bootstrap';

const GET_COMPLAINTS = gql`
  query {
    getComplaints {
      id
      description
      status {
        name
      }
      user {
        name
      }
     
    }
  }
`;

const Complaints = () => {
  const { loading, error, data } = useQuery(GET_COMPLAINTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Complaints</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Status</th>
            <th>User</th>
            {/* <th>Created At</th>
            <th>Updated At</th> */}
          </tr>
        </thead>
        <tbody>
          {data.getComplaints.map((complaint) => (
            <tr key={complaint.id}>
              <td>{complaint.id}</td>
              <td>{complaint.description}</td>
              <td>{complaint.status.name}</td>
              <td>{complaint.user.name}</td>
              {/* <td>{complaint.createdAt}</td>
              <td>{complaint.updatedAt}</td> */}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Complaints;
