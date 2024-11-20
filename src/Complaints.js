
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

  });

  const statusOptions = [
    { label: 'Open', value: 'Open' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Closed', value: 'Closed' },
  ];
  const [focused, setFocused] = useState(false);

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
          onClick={openDialog}
          style={{
            backgroundColor: '#2c3e50', // Matching professional color (dark blue-grey)
            color: 'white', // White text for contrast
            border: '2px solid #2c3e50', // Border matching the button color
            padding: '10px 20px', // Padding for better spacing
            borderRadius: '5px', // Rounded corners
            fontSize: '14px', // Adjust font size
            fontWeight: 'bold', // Bold font weight
            transition: 'background-color 0.3s, border-color 0.3s', // Smooth transition for hover effects
          }}
          onFocus={(e) => {
            e.target.style.boxShadow = '0 0 5px rgba(44, 62, 80, 0.5)'; // Subtle shadow effect on focus
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = 'none'; // Remove shadow when focus is lost
          }}
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






          <div className="form-field">
            <label htmlFor="user">User</label>
            <Dropdown
              id="user"
              name="user"
              value={newComplaint.user}
              options={statusOptions} // Replace with actual options for user status
              onChange={handleDropdownChange}
              placeholder="Select User"
              onFocus={() => setFocused(true)} // Set focus state to true when focused
              onBlur={() => setFocused(false)} // Set focus state to false when focus is lost
              style={{
                borderColor: focused ? '#2c3e50' : '#ccc', // Apply color on focus
                boxShadow: focused ? '0 0 5px rgba(44, 62, 80, 0.5)' : 'none', // Apply shadow effect on focus
                padding: '10px', // Optional: Padding for consistent spacing
                borderRadius: '5px', // Rounded corners for a clean look
              }}
            />
          </div>






        </div>
      </Dialog>

    </div>
  );
};

export default Complaints;

