// // src/components/Complaints.js
// import React from 'react';
// import { useQuery, gql } from '@apollo/client';
// import { Table, Button, Container, Row, Col } from 'react-bootstrap';

// const GET_COMPLAINTS = gql`
//   query {
//     getComplaints {
//       id
//       description
//       status {
//         name
//       }
//       user {
//         name
//       }

//     }
//   }
// `;

// const Complaints = () => {
//   const { loading, error, data } = useQuery(GET_COMPLAINTS);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error.message}</p>;

//   // return (
//   //   <div>
//   //     <h1>Complaints</h1>
//   //     <Table striped bordered hover>
//   //       <thead>
//   //         <tr>
//   //           <th>ID</th>
//   //           <th>Description</th>
//   //           <th>Status</th>
//   //           <th>User</th>
//   //           {/* <th>Created At</th>
//   //           <th>Updated At</th> */}
//   //         </tr>
//   //       </thead>
//   //       <tbody>
//   //         {data.getComplaints.map((complaint) => (
//   //           <tr key={complaint.id}>
//   //             <td>{complaint.id}</td>
//   //             <td>{complaint.description}</td>
//   //             <td>{complaint.status.name}</td>
//   //             <td>{complaint.user.name}</td>
//   //             {/* <td>{complaint.createdAt}</td>
//   //             <td>{complaint.updatedAt}</td> */}
//   //           </tr>
//   //         ))}
//   //       </tbody>
//   //     </Table>
//   //   </div>
//   // );
//   return (
//     <Container className="mt-4">
//       <Row className="align-items-center mb-3">
//         <Col>
//           <h1 className="text-center">Complaints</h1>
//         </Col>
//         <Col className="text-end">
//           <Button variant="primary">+ Add Complaint</Button>
//         </Col>
//       </Row>
//       <Table striped bordered hover responsive className="shadow-sm">
//         <thead className="table-primary">
//           <tr>
//             <th>ID</th>
//             <th>Description</th>
//             <th>Status</th>
//             <th>User</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.getComplaints.map((complaint) => (
//             <tr key={complaint.id}>
//               <td>{complaint.id}</td>
//               <td>{complaint.description}</td>
//               <td>{complaint.status.name}</td>
//               <td>{complaint.user.name}</td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </Container>
//   );
// };

// export default Complaints;


// src/components/Complaints.js
// import React, { useState } from 'react';
// import { useQuery, gql } from '@apollo/client';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { Button } from 'primereact/button';
// import { Dialog } from 'primereact/dialog';
// import { InputText } from 'primereact/inputtext';

// import 'primereact/resources/themes/saga-blue/theme.css'; /* Replace with your preferred theme */
// import 'primereact/resources/primereact.min.css';
// import 'primeicons/primeicons.css';
// import 'primeflex/primeflex.css';



// const GET_COMPLAINTS = gql`
//   query {
//     getComplaints {
//       id
//       description
//       status {
//         name
//       }
//       user {
//         name
//       }
//     }
//   }
// `;

// const Complaints = () => {
//   const { loading, error, data } = useQuery(GET_COMPLAINTS);
//   const [showDialog, setShowDialog] = useState(false);
//   const [newComplaint, setNewComplaint] = useState({
//     description: '',
//     status: '',
//     user: '',
//   });

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error.message}</p>;

//   const openDialog = () => setShowDialog(true);
//   const closeDialog = () => setShowDialog(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewComplaint({ ...newComplaint, [name]: value });
//   };

//   const addComplaint = () => {
//     console.log('Adding Complaint:', newComplaint);
//     closeDialog();
//   };

//   return (
//     <div className="p-4">
//       <div className="flex justify-content-between align-items-center mb-3">
//         <h2>Complaints</h2>
//         <Button
//           label="Add Complaint"
//           icon="pi pi-plus"
//           className="p-button-outlined p-button-primary"
//           onClick={openDialog}
//         />
//       </div>
//       <DataTable
//         value={data.getComplaints}
//         paginator
//         rows={5}
//         stripedRows
//         responsiveLayout="scroll"
//         className="shadow-2"
//       >
//         <Column field="id" header="ID" sortable></Column>
//         <Column field="description" header="Description" sortable></Column>
//         <Column field="status.name" header="Status" sortable></Column>
//         <Column field="user.name" header="User" sortable></Column>
//       </DataTable>

//       <Dialog
//   header="Add Complaint"
//   visible={showDialog}
//   style={{ width: '30vw' }}
//   modal
//   onHide={closeDialog}
//   footer={
//     <div className="flex justify-content-end gap-2">
//       <Button
//         label="Cancel"
//         icon="pi pi-times"
//         className="p-button-text"
//         onClick={closeDialog}
//       />
//       <Button
//         label="Save"
//         icon="pi pi-check"
//         className="p-button-primary"
//         onClick={addComplaint}
//       />
//     </div>
//   }
// >
//   <div className="formgrid grid">
//     {/* Description Field */}
//     <div className="field col-12">
//       <label htmlFor="description" className="block font-medium mb-2">
//         Description
//       </label>
//       <InputText
//         id="description"
//         name="description"
//         value={newComplaint.description}
//         onChange={handleInputChange}
//         className="w-full"
//       />
//     </div>

//     {/* Status Field */}
//     <div className="field col-12">
//       <label htmlFor="status" className="block font-medium mb-2">
//         Status
//       </label>
//       <InputText
//         id="status"
//         name="status"
//         value={newComplaint.status}
//         onChange={handleInputChange}
//         className="w-full"
//       />
//     </div>

//     {/* User Field */}
//     <div className="field col-12">
//       <label htmlFor="user" className="block font-medium mb-2">
//         User
//       </label>
//       <InputText
//         id="user"
//         name="user"
//         value={newComplaint.user}
//         onChange={handleInputChange}
//         className="w-full"
//       />
//     </div>
//   </div>
// </Dialog>

//     </div>
//   );
// };

// export default Complaints;

import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import 'primereact/resources/themes/saga-blue/theme.css'; // Replace with your preferred theme
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'primeflex/primeflex.css'; // For layout utilities
import './Complaints.css'; // Custom CSS file for styling

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
  const [showDialog, setShowDialog] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    description: '',
    user: null,
    user: '',
  });

  const statusOptions = [
    { label: 'Open', value: 'Open' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Closed', value: 'Closed' },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const openDialog = () => setShowDialog(true);
  const closeDialog = () => setShowDialog(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComplaint({ ...newComplaint, [name]: value });
  };

  const handleDropdownChange = (e) => {
    setNewComplaint({ ...newComplaint, user: e.value });
  };

  const addComplaint = () => {
    console.log('Adding Complaint:', newComplaint);
    closeDialog();
  };

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="flex justify-content-between align-items-center mb-4">
        <h2 className="text-2xl font-bold">Complaints</h2>
        
        <Button
          label="Add Complaint"
          icon="pi pi-plus"
          className="p-button-outlined p-button-primary"
          onClick={openDialog}
        />
      </div>

      {/* Complaints Table */}
      <DataTable
        value={data.getComplaints}
        paginator
        rows={5}
        stripedRows
        responsiveLayout="scroll"
        className="shadow-2 rounded-md"
      >
        <Column field="id" header="ID" sortable></Column>
        <Column field="description" header="Description" sortable></Column>
        <Column field="status.name" header="Status" sortable></Column>
        <Column field="user.name" header="User" sortable></Column>
      </DataTable>

      {/* Dialog for Adding Complaint */}
      <Dialog
        header={<h3 className="dialog-title">Add Complaint</h3>}
        visible={showDialog}
        style={{ width: '40vw' }}
        modal
        onHide={closeDialog}
        className="custom-dialog"
        footer={
          <div className="dialog-footer">
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="cancel-button"
              onClick={closeDialog}
            />
            <Button
              label="Save"
              icon="pi pi-check"
              className="save-button"
              onClick={addComplaint}
            />
          </div>
        }
      >
        <div className="form-grid">
          {/* Description Field */}
          <div className="form-field">
            <label htmlFor="description">Description</label>
            <InputText
              id="description"
              name="description"
              value={newComplaint.description}
              onChange={handleInputChange}
            />
          </div>
         


          {/* Status Field */}
          {/* <div className="form-field">
            <label htmlFor="status">User</label>
            <Dropdown
              id="user"
              name="user"
              value={newComplaint.user}
              options={statusOptions}
              onChange={handleDropdownChange}
              placeholder="Select Status"
            />
          </div> */}
          <div className="form-field">
            <label htmlFor="user">User</label>
            <Dropdown
              id="user"
              name="user"
              value={newComplaint.user}
              options={statusOptions} // Replace with actual options for user status
              onChange={handleDropdownChange}
              placeholder="Select User"
            />
          </div>

          <div className="form-field">
  <label htmlFor="user">User</label>
  <Dropdown
    id="user"
    name="user"
    value={newComplaint.user}
    options={statusOptions} // Replace with actual options for user status
    onChange={handleDropdownChange}
    placeholder="Select User"
  />
</div>



          {/* User Field */}
          {/* <div className="form-field">
            <label htmlFor="user">User</label>
            <InputText
              id="user"
              name="user"
              value={newComplaint.user}
              onChange={handleInputChange}
            />
          </div> */}
        </div>
      </Dialog>

    </div>
  );
};

export default Complaints;

