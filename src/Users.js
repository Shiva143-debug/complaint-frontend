import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { MdDelete } from "react-icons/md";
import { InputText } from 'primereact/inputtext';
import LoaderSpinner from './LoaderSpinner';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './Complaints.css';

const GET_USERS = gql`
  query {
    getUsers {
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

const ADD_USER = gql`
  mutation addUser($user: AddUserInput!) {
    addUser(user: $user) {
      name
    }
  }
`;

const DELETE_USER = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
      name
    }
  }
`;

const Users = () => {
  const { loading: usersLoading, error: usersError, data } = useQuery(GET_USERS);
  const { loading: rolesLoading, error: rolesError, data: rolesData } = useQuery(GET_ROLES);
  const [showDialog, setShowDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role_id: null,
  });
  const [focused, setFocused] = useState(false);
  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: (data) => {
      console.log("User Deleted:", data);
      closeDialog();
      setShowDeleteConfirmDialog(false); 
    },
    onError: (error) => {
      console.error("Error deleting user:", error.message);
    },
    refetchQueries: [
      {
        query: GET_USERS,
      },
    ],
  });

  const [addUser] = useMutation(ADD_USER, {
    onCompleted: (data) => {
      console.log("User added:", data);
      setNewUser({ name: '', email: '', phone: '', role_id: null });
      closeDialog();
    },
    onError: (error) => {
      console.error("Error adding user:", error.message);
    },
    refetchQueries: [
      {
        query: GET_USERS,
      },
    ],
  });

  const [selectedUserForDelete, setSelectedUserForDelete] = useState(null); 
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);

  if (usersLoading || rolesLoading) return <LoaderSpinner />;
  if (usersError) return <p>Error: {usersError.message}</p>;
  if (rolesError) return <p>Error: {rolesError.message}</p>;

  const roleOptions = rolesData ? rolesData.getRoles.map(role => ({
    label: role.role_name,
    value: role.id
  })) : [];

  const openDialog = () => setShowDialog(true);
  const closeDialog = () => setShowDialog(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleDropdownChange = (e) => {
    setNewUser({ ...newUser, role_id: e.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, phone, role_id } = newUser;
    const variables = {
      user: {
        name,
        email,
        phone,
        role_id: parseInt(role_id, 10),
      },
    };

    addUser({ variables });
  };

  const onDeleteUser = (user) => {
    setSelectedUserForDelete(user);
    setShowDeleteConfirmDialog(true);  
  };


  const confirmDelete = () => {
    if (selectedUserForDelete) {
      deleteUser({ variables: { id: selectedUserForDelete.id } });
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmDialog(false);
  };

  const ActionBodyTemplate = (rowData) => {
    return <MdDelete size={40} style={{ color: "red" }} onClick={() => onDeleteUser(rowData)} />;
  };

  return (
    <div className='complaint-container' style={{ height: "90vh" }}>
      <div className="flex justify-content-between mb-5 mt-5" style={{ width: "80vw" }}>
        <h2 className="text-5xl font-bold text-white">Users</h2>
        <Button label="Add User" icon="pi pi-plus" onClick={openDialog} style={{ backgroundColor: '#2c3e50', color: 'white', border: '2px solid #2c3e50', padding: '10px 20px', borderRadius: '5px', fontSize: '14px', fontWeight: 'bold', transition: 'background-color 0.3s, border-color 0.3s' }} />
      </div>
      <DataTable value={data.getUsers} paginator rows={8} stripedRows responsiveLayout="scroll" className="shadow-2 rounded-md custom-table" style={{ width: "80vw" }}>
        <Column field="name" header="Name" sortable></Column>
        <Column field="email" header="Email" sortable></Column>
        <Column field="phone" header="Phone" sortable></Column>
        <Column field="role.role_name" header="Role" sortable></Column>
        <Column body={ActionBodyTemplate} header="Actions" sortable></Column>
      </DataTable>

      <Dialog header={<h3 className="dialog-title">ADD USER</h3>} visible={showDialog} style={{ width: '40vw' }} modal onHide={closeDialog} className="custom-dialog"
        footer={
          <div className="dialog-footer">
            <Button label="Cancel" icon="pi pi-times" onClick={closeDialog} className="btn btn-outline-danger mx-2" />
            <Button label="Save" icon="pi pi-check" onClick={handleSubmit} className="btn btn-primary" />
          </div>
        }>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="description">Name:</label>
            <InputText id="name" name="name" value={newUser.name} onChange={handleInputChange} />
          </div>
          <div className="form-field">
            <label htmlFor="description">Email:</label>
            <InputText id="email" name="email" value={newUser.email} onChange={handleInputChange} />
          </div>
          <div className="form-field">
            <label htmlFor="description">Mobile No:</label>
            <InputText id="phone" name="phone" value={newUser.phone} onChange={handleInputChange} />
          </div>
          <div className="form-field">
            <label htmlFor="user">Select Role:</label>
            <Dropdown id="role" options={roleOptions} value={newUser.role_id} onChange={handleDropdownChange} placeholder="Select User" onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={{ borderColor: focused ? '#2c3e50' : '#ccc', boxShadow: focused ? '0 0 5px rgba(44, 62, 80, 0.5)' : 'none', padding: '10px', borderRadius: '5px' }} />
          </div>
        </div>
      </Dialog>

      <Dialog header="Confirm Deletion" visible={showDeleteConfirmDialog} modal style={{ width: '30vw' }} onHide={cancelDelete}>
        <p>Are you sure you want to delete this user?</p>
        <Button label="Yes" icon="pi pi-check" onClick={confirmDelete} className="p-button-danger mx-2" />
        <Button label="No" icon="pi pi-times" onClick={cancelDelete} className="p-button-secondary" />
      </Dialog>
    </div>
  );
};

export default Users;
