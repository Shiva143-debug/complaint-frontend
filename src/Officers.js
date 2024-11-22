
import { DataTable } from 'primereact/datatable';
import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './Complaints.css'; 
import LoaderSpinner from './LoaderSpinner';


const GET_OFFICERS = gql`
  query {
    getOfficers {
      id
      name
      email
      phone
      role{
      role_name
      }
    }
  }
`;

const GET_ROLES = gql`
  query {
    getRoles {
      id
      role_name
    }
  }
`;


const ADD_OFFICER = gql`
  mutation addOfficer($officer: AddOfficerInput!) {
    addOfficer(officer: $officer) {
      name
    }
  }
`;

const Officers = () => {
  const { loading: officerLoading, error: officerError, data } = useQuery(GET_OFFICERS);
  const { loading: officersLoading, error: rolesError, data: rolesData } = useQuery(GET_ROLES);
  const [showDialog, setShowDialog] = useState(false);
  const [newOfficer, setNewOfficer] = useState({
    name: '',
    email: '',
    phone: '',
    role_id: null,
  });
  const [focused, setFocused] = useState(false);

  const [addUser] = useMutation(ADD_OFFICER, {
    onCompleted: (data) => {
      console.log("User added:", data);
      setNewOfficer({ name: '', email: '', phone: '', role_id: null });
      closeDialog();
    },
    onError: (error) => {
      console.error("Error adding user:", error.message);
    },
    refetchQueries: [
      {
        query: GET_OFFICERS,
      },
    ],
  });

  if (officerLoading || officersLoading) return <LoaderSpinner/>;
  if (officerError) return <p>Error: {officerError.message}</p>;
  if (rolesError) return <p>Error: {rolesError.message}</p>;

  const roleOptions = rolesData ? rolesData.getRoles.map(role => ({
    label: role.role_name,
    value: role.id
  })) : [];

  const openDialog = () => setShowDialog(true);
  const closeDialog = () => setShowDialog(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOfficer({ ...newOfficer, [name]: value });
  };

  const handleDropdownChange = (e) => {
    setNewOfficer({ ...newOfficer, role_id: e.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, phone, role_id } = newOfficer;
    const variables = {
      officer: {
        name,
        email,
        phone,
        role_id: parseInt(role_id, 10),
      },
    };

    addUser({ variables });
  };


  return (
    <div className='complaint-container'>
      <div className="flex justify-content-between align-items-center mb-4">
        <h2 className="text-2xl font-bold">Officers</h2>

        <Button label="Add Officer" icon="pi pi-plus" onClick={openDialog} style={{ backgroundColor: '#2c3e50', color: 'white', border: '2px solid #2c3e50', padding: '10px 20px', borderRadius: '5px', fontSize: '14px', fontWeight: 'bold', transition: 'background-color 0.3s, border-color 0.3s', }}
          onFocus={(e) => {
            e.target.style.boxShadow = '0 0 5px rgba(44, 62, 80, 0.5)';
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>
      <DataTable value={data.getOfficers} paginator rows={10} stripedRows responsiveLayout="scroll" className="shadow-2 rounded-md" style={{width:"80vw"}}>
        <Column field="name" header="Name" sortable></Column>
        <Column field="email" header="Email" sortable></Column>
        <Column field="phone" header="Phone" sortable></Column>
        <Column field="role.role_name" header="Role" sortable></Column>
        {/* <Column body={ActionBodyTemplate} header="Actions" sortable></Column> */}
      </DataTable>

      <Dialog header={<h3 className="dialog-title">Add User</h3>} visible={showDialog} style={{ width: '40vw' }} modal onHide={closeDialog} className="custom-dialog"
        footer={
          <div className="dialog-footer">
            <Button label="Cancel" icon="pi pi-times" className="cancel-button" onClick={closeDialog} />
            <Button label="Save" icon="pi pi-check" className="save-button" onClick={handleSubmit} />
          </div>
        }
      >

        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="description">Name:</label>
            <InputText id="name" name="name" value={newOfficer.name} onChange={handleInputChange} />
          </div>

          <div className="form-field">
            <label htmlFor="description">Email:</label>
            <InputText id="email" name="email" value={newOfficer.email} onChange={handleInputChange} />
          </div>

          <div className="form-field">
            <label htmlFor="description">Mobile No:</label>
            <InputText id="phone" name="phone" value={newOfficer.phone} onChange={handleInputChange} />
          </div>


          <div className="form-field">
            <label htmlFor="user">Select Role:</label>
            <Dropdown id="role" options={roleOptions} value={newOfficer.role_id} onChange={handleDropdownChange} placeholder="Select User" onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={{ borderColor: focused ? '#2c3e50' : '#ccc', boxShadow: focused ? '0 0 5px rgba(44, 62, 80, 0.5)' : 'none', padding: '10px', borderRadius: '5px', }}
            />
          </div>
        </div>
      </Dialog>

    </div>
  );
};

export default Officers;
