import React, { useState } from 'react';
import { useQuery, gql,useMutation,useLazyQuery } from '@apollo/client';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { FaHistory } from "react-icons/fa";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'primeflex/primeflex.css';
import './Complaints.css';

const GET_COMPLAINTS = gql`
  query {
    getComplaints {
      id
      description
      updated_at
      status {
        name
      }
      user {
        name
      }
        assignedOfficer{
      name
      }
    }
  }
`;

const GET_COMPLAINT_BY_ID = gql`
  query getComplaintById($id: ID!) {
    getComplaintById(id: $id) {
      description
      updated_at
      status {
        name
      }
      user {
        name
      }
      assignedOfficer {
        name
      }
    }
  }
`;

const ADD_COMPLAINT = gql`
  mutation addComplaint($complaint: AddComplaintInput!) {
    addComplaint(complaint: $complaint) {
      description
    }
  }
`;

const Complaints = () => {
  const { loading, error, data } = useQuery(GET_COMPLAINTS);
  const [fetchComplaintById, { data: complaintDetails, loading: historyLoading, error: historyError }] = useLazyQuery(GET_COMPLAINT_BY_ID);
  const [showDialog, setShowDialog] = useState(false);
  const [showcomplaintHistory, setShowcomplaintHistory] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    description: '',

  });
  const [addComplaint] = useMutation(ADD_COMPLAINT, {
    onCompleted: (data) => {
      console.log("complaint created:", data);
      setNewComplaint({description:""});
      closeDialog();
    },
    onError: (error) => {
      console.error("Error adding complaint:", error.message);
    },
    refetchQueries: [
        {
          query: GET_COMPLAINTS,
        },
      ],
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const openDialog = () => setShowDialog(true);
  const closeDialog = () => setShowDialog(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComplaint({ ...newComplaint, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { description} = newComplaint;
    const complaintInput = {
      description, 
      user_id: 1, 
      assigned_officer_id: 1, 
      status_id: 1,
    };
    addComplaint({ variables: { complaint: complaintInput } });
  };

  const onHistory=(rowData)=>{
    const { id } = rowData;
    fetchComplaintById({
      variables: { id },
      onCompleted: () => {
        setShowcomplaintHistory(true); 
      },
      onError: (error) => {
        console.error("Error fetching complaint by ID:", error.message);
      },
    });
  }

  const ActionBodyTemplate=(rowData)=>{
       return <FaHistory size={40} onClick={onHistory(rowData)}/>
  }

  return (
    <div className="p-4">
      <div className="flex justify-content-between align-items-center mb-4">
        <h2 className="text-2xl font-bold">Complaints</h2>
        <Button label="Add Complaint" icon="pi pi-plus" onClick={openDialog}
          style={{backgroundColor: '#2c3e50',color: 'white',border: '2px solid #2c3e50',padding: '10px 20px',borderRadius: '5px',fontSize: '14px',fontWeight: 'bold',transition: 'background-color 0.3s, border-color 0.3s',}}
          onFocus={(e) => {
            e.target.style.boxShadow = '0 0 5px rgba(44, 62, 80, 0.5)';
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = 'none';
          }}
        />

      </div>

      <DataTable value={data.getComplaints} paginator rows={5} stripedRows responsiveLayout="scroll" className="shadow-2 rounded-md">
        <Column field="description" header="Description" sortable></Column>
        <Column field="user.name" header="complaintCreatedBy" sortable></Column>
        <Column field="assignedOfficer.name" header="AssignedTo" sortable></Column>
        <Column field="status.name" header="Status" sortable></Column>
        <Column field="updated_at" header="UpdatedAt" sortable></Column>
        <Column body={ActionBodyTemplate} header="Actions" sortable></Column>
      </DataTable>

      <Dialog header={<h3 className="dialog-title">Add Complaint</h3>} visible={showDialog} style={{ width: '40vw' }} modal onHide={closeDialog} className="custom-dialog"
        footer={
          <div className="dialog-footer">
            <Button label="Cancel" icon="pi pi-times" className="cancel-button" onClick={closeDialog}/>
            <Button label="Save"icon="pi pi-check" className="save-button" onClick={handleSubmit}/>
          </div>
        }
      >
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="description">Description:</label>
            <InputText id="description" name="description" value={newComplaint.description} onChange={handleInputChange}/>
          </div>
        </div>
      </Dialog>

      <Dialog 
  header={<h3 className="dialog-title">Complaint Details</h3>} 
  visible={showcomplaintHistory} 
  style={{ width: '40vw' }} 
  modal 
  onHide={closeDialog}
  className="custom-dialog"
>
  {historyLoading ? (
    <p>Loading complaint details...</p>
  ) : historyError ? (
    <p>Error loading details: {historyError.message}</p>
  ) : (
    complaintDetails && (
      <div>
        <p><strong>Description:</strong> {complaintDetails.getComplaintById.description}</p>
        <p><strong>Status:</strong> {complaintDetails.getComplaintById.status.name}</p>
        <p><strong>Updated At:</strong> {complaintDetails.getComplaintById.updated_at}</p>
        <p><strong>Assigned Officer:</strong> {complaintDetails.getComplaintById.assignedOfficer.name}</p>
        <p><strong>User:</strong> {complaintDetails.getComplaintById.user.name}</p>
      </div>
    )
  )}
</Dialog>

    </div>
  );
};

export default Complaints;

