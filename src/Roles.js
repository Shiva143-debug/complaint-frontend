import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { FaEye } from "react-icons/fa";
import { Checkbox } from 'primereact/checkbox';
import { MdDelete } from "react-icons/md";
import LoaderSpinner from './LoaderSpinner';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'primeflex/primeflex.css';
import './Complaints.css';

const GET_ROLES = gql`
  query  {
  getRoles {
    id
    access_function
    role_name
  }
  }
`;

const GET_PERMISSIONS = gql`
  query  {
    getPermissions {
    id
    permission_code
    permission_name
    }
  }
`;


const ADD_ROLE = gql`
  mutation addRole($role: AddRoleInput!) {
    addRole(role: $role) {
      role_name
      access_function
    }
  }
`;

const DELETE_ROLE = gql`
  mutation deleteRole($id: ID!) {
  deleteRole(id: $id) {
      role_name
    }

  }
`;

const Roles = () => {
  const { loading, error, data } = useQuery(GET_ROLES);
  const { loading: permissionsLoading, error: permissionsError, data: permissionsData } = useQuery(GET_PERMISSIONS);
  const [showDialog, setShowDialog] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [showViewDialogue, setShowViewDialogue] = useState(false);
  const [selectedAccessFunction, setSelectedAccessFunction] = useState('');
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const handleCheckboxChange = (permissionCode) => {
    setSelectedPermissions((prevPermissions) =>
      prevPermissions.includes(permissionCode)
        ? prevPermissions.filter((code) => code !== permissionCode)
        : [...prevPermissions, permissionCode]
    );
  };


  const [addRole] = useMutation(ADD_ROLE, {
    onCompleted: () => {
      closeDialog();
    },
    onError: (error) => console.error('Error adding role:', error.message),
    refetchQueries: [{ query: GET_ROLES }],
  });


  const [deleteRole] = useMutation(DELETE_ROLE, {
    onCompleted: () => {
      setDeleteDialogVisible(false);
    },
    onError: (error) => {
      console.error("Error deleting officer:", error.message);
    },
    refetchQueries: [{ query: GET_ROLES }],
  });

  if (loading || permissionsLoading) return <LoaderSpinner />;
  if (error || permissionsError) return <p>Error: {error.message}</p>;

  const openDialog = () => setShowDialog(true);

  const openViewDialog = (rowData) => {
    setSelectedAccessFunction(rowData.access_function);
    setShowViewDialogue(true);
  };


  const closeDialog = () => {
    setShowDialog(false);
    setShowViewDialogue(false);
    setSelectedAccessFunction('');
  };

  const closeDeleteDialog = () => {
    setSelectedRole(null);
    setDeleteDialogVisible(false);
  };

  const openDeleteDialog = (officer) => {
    setSelectedRole(officer);
    setDeleteDialogVisible(true);
  };

  const confirmDelete = () => {
    if (selectedRole) {
      deleteRole({ variables: { id: selectedRole.id } });
    }
  };


  const ActionBodyTemplate = (rowData) => (
    <>
      <FaEye  onClick={() => openViewDialog(rowData)} style={{ cursor: 'pointer',color:"blue" }} size={40} />
      <MdDelete size={40} style={{ color: "red" }} onClick={() => openDeleteDialog(rowData)} />
    </>
  );


  const handleSubmit = async () => {
    const accessFunction = selectedPermissions.join(',');
    const newRole = { role_name: roleName, access_function: accessFunction };

    try {
      await addRole({ variables: { role: newRole } });
      closeDialog();
    } catch (err) {
      console.error('Error adding role:', err.message);
    }
  };

  return (
    <div className='complaint-container' style={{ height: "90vh" }}>
      <div className="flex justify-content-between mb-5 mt-5" style={{ width: "80vw" }}>
        <h2 className="text-5xl font-bold text-white" >Roles</h2>
        <Button label="Add Role" icon="pi pi-plus" onClick={openDialog}
          style={{ backgroundColor: '#2c3e50', color: 'white', border: '2px solid #2c3e50', padding: '10px 20px', borderRadius: '5px', fontSize: '14px', fontWeight: 'bold', transition: 'background-color 0.3s, border-color 0.3s', }} />
      </div>

      <DataTable value={data.getRoles} paginator rows={6} stripedRows responsiveLayout="scroll" className="shadow-2 rounded-md custom-table" style={{ width: "80vw" }}>
        <Column field="role_name" header="ROLE" sortable></Column>
        <Column body={ActionBodyTemplate} header="Actions" sortable></Column>s
      </DataTable>


      <Dialog header={<h3 className="dialog-title">Add Role</h3>} visible={showDialog} style={{ width: '60vw' }} modal onHide={closeDialog} className="custom-dialog"
        footer={
          <div className="dialog-footer">
            <Button label="Cancel" icon="pi pi-times" onClick={closeDialog} className="btn btn-outline-danger mx-2" />
            <Button label="Save" icon="pi pi-check" onClick={handleSubmit} className="btn btn-primary" />
          </div>
        }
      >
        <div className="form-grid">
          <div className="row mt-2">
            <label htmlFor="description" className='col-md-2'>ROLE NAME:</label>
            <InputText id="description" name="description" value={roleName}  onChange={(e) => setRoleName(e.target.value)} className='form-control col-md-6' style={{ flex: 1 }} />
          </div>

          <div className="d-flex flex-column">
            <label htmlFor="description" className='pb-3'>PERMISSIONS:</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              {permissionsData.getPermissions.map((permission) => (
                <div  key={permission.id}  style={{display: 'flex',alignItems: 'center',border: '1px solid #ccc',borderRadius: '5px',padding: '5px 10px',}}>
                  <Checkbox inputId={`permission-${permission.id}`} value={permission.permission_code} checked={selectedPermissions.includes( permission.permission_code)}onChange={() => handleCheckboxChange(permission.permission_code)}/>
                  <label htmlFor={`permission-${permission.id}`} style={{ marginLeft: '10px' }}>{permission.permission_name}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog header={<h3 className="dialog-title">Permissions</h3>} visible={showViewDialogue} style={{ width: '40vw' }} modal onHide={closeDialog} className="custom-dialog">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '15px' }}>
          {selectedAccessFunction.split(',').map((permission, index) => (
            <div key={index} style={{backgroundColor: '#f4f4f4',border: '1px solid #ddd',padding: '10px 15px',borderRadius: '8px',boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',fontSize: '14px',fontWeight: 'bold',color: '#333',textAlign: 'center',}}>
              {permission.trim()}
            </div>
          ))}
        </div>
      </Dialog>


      <Dialog header="Confirm Deletion" visible={deleteDialogVisible} style={{ width: '30vw' }} modal onHide={closeDeleteDialog}
        footer={
          <div className="dialog-footer">
            <Button label="No" icon="pi pi-times" onClick={closeDeleteDialog} className="p-button-secondary mx-2" />
            <Button label="Yes" icon="pi pi-check" onClick={confirmDelete} className="p-button-danger" />
          </div>
        }
      >
        <p>Are you sure you want to delete this ROLE?</p>
      </Dialog>
    </div>
  );
};

export default Roles;
