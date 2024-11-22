import { DataTable } from 'primereact/datatable';
import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { MdDelete } from "react-icons/md";
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
      role {
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

const DELETE_OFFICER = gql`
  mutation deleteOfficer($id: ID!) {
    deleteOfficer(id: $id) {
      id
    }
  }
`;

const Officers = () => {
  const { loading: officerLoading, error: officerError, data } = useQuery(GET_OFFICERS);
  const { loading: officersLoading, error: rolesError, data: rolesData } = useQuery(GET_ROLES);
  const [showDialog, setShowDialog] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [newOfficer, setNewOfficer] = useState({
    name: '',
    email: '',
    phone: '',
    role_id: null,
  });
  const [focused, setFocused] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState(null);

  const [addOfficer] = useMutation(ADD_OFFICER, {
    onCompleted: () => {
      setNewOfficer({ name: '', email: '', phone: '', role_id: null });
      closeDialog();
    },
    onError: (error) => {
      console.error("Error adding Officer:", error.message);
    },
    refetchQueries: [{ query: GET_OFFICERS }],
  });

  const [deleteOfficer] = useMutation(DELETE_OFFICER, {
    onCompleted: () => {
      setDeleteDialogVisible(false);
    },
    onError: (error) => {
      console.error("Error deleting officer:", error.message);
    },
    refetchQueries: [{ query: GET_OFFICERS }],
  });

  if (officerLoading || officersLoading) return <LoaderSpinner />;
  if (officerError) return <p>Error: {officerError.message}</p>;
  if (rolesError) return <p>Error: {rolesError.message}</p>;

  const roleOptions = rolesData ? rolesData.getRoles.map((role) => ({
    label: role.role_name,
    value: role.id,
  })) : [];

  const openDialog = () => setShowDialog(true);
  const closeDialog = () => setShowDialog(false);

  const openDeleteDialog = (officer) => {
    setSelectedOfficer(officer);
    setDeleteDialogVisible(true);
  };

  const closeDeleteDialog = () => {
    setSelectedOfficer(null);
    setDeleteDialogVisible(false);
  };

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
    addOfficer({ variables });
  };

  const confirmDelete = () => {
    if (selectedOfficer) {
      deleteOfficer({ variables: { id: selectedOfficer.id } });
    }
  };

  return (
    <div className='complaint-container' style={{ height: "90vh" }}>
      <div className="flex justify-content-between mb-5 mt-5" style={{ width: "80vw" }}>
        <h2 className="text-5xl font-bold text-white">Officers</h2>
        <Button label="Add Officer" icon="pi pi-plus" onClick={openDialog} style={{ backgroundColor: '#2c3e50', color: 'white', border: '2px solid #2c3e50', padding: '10px 20px', borderRadius: '5px', fontSize: '14px', fontWeight: 'bold', transition: 'background-color 0.3s, border-color 0.3s' }} />
      </div>
      <DataTable value={data.getOfficers} paginator rows={8} stripedRows responsiveLayout="scroll" className="shadow-2 rounded-md custom-table" style={{ width: "80vw" }}>
        <Column field="name" header="Name" sortable />
        <Column field="email" header="Email" sortable />
        <Column field="phone" header="Phone" sortable />
        <Column field="role.role_name" header="Role" sortable />
        <Column header="Actions" body={(rowData) => ( <MdDelete size={40} style={{ color: "red" }} onClick={() => openDeleteDialog(rowData)}/>)} />
      </DataTable>

      <Dialog header={<h3 className="dialog-title">Add Officer</h3>} visible={showDialog} style={{ width: '40vw' }} modal onHide={closeDialog} className="custom-dialog"
        footer={
          <div className="dialog-footer">
            <Button label="Cancel" icon="pi pi-times" onClick={closeDialog} className="btn btn-outline-danger mx-2"/>
            <Button label="Save" icon="pi pi-check" onClick={handleSubmit} className="btn btn-primary"/>
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
            <Dropdown id="role" options={roleOptions} value={newOfficer.role_id} onChange={handleDropdownChange} placeholder="Select Role" onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
              style={{ borderColor: focused ? '#2c3e50' : '#ccc', boxShadow: focused ? '0 0 5px rgba(44, 62, 80, 0.5)' : 'none', padding: '10px', borderRadius: '5px',}}/>
          </div>
        </div>
      </Dialog>

      <Dialog  header="Confirm Deletion" visible={deleteDialogVisible} style={{ width: '30vw' }} modal onHide={closeDeleteDialog}
        footer={
          <div className="dialog-footer">
            <Button label="No" icon="pi pi-times" onClick={closeDeleteDialog} className="p-button-secondary mx-2"/>
            <Button label="Yes" icon="pi pi-check" onClick={confirmDelete} className="p-button-danger"/>
          </div>
        }
      >
        <p>Are you sure you want to delete this officer?</p>
      </Dialog>
    </div>
  );
};

export default Officers;
