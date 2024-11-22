import React, { useState } from 'react';
import { useQuery, gql, useMutation, useLazyQuery } from '@apollo/client';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { FaHistory } from "react-icons/fa";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'primeflex/primeflex.css';
import './Complaints.css';
import LoaderSpinner from './LoaderSpinner';

const GET_COMPLAINTS_BY_USERID = gql`
  query  {
    getComplaintById(user_id: 2) {
        id
        description
        assignedOfficer {
        name
        }
        status {
        name
        }
        created_at
        updated_at
    }
  }
`;

const GET_HISTORY = gql`
  query getAuditLog($complaintId: ID!) {
  getAuditLog(complaint_id: $complaintId) {
    action
    details
    performedBy {
      name
    }complaint{
    description
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


const Mycomplaints = () => {
  const { loading, error, data } = useQuery(GET_COMPLAINTS_BY_USERID);
  const [fetchComplaintById, { data: getAuditLog, loading: historyLoading, error: historyError }] = useLazyQuery(GET_HISTORY);
  const [showDialog, setShowDialog] = useState(false);
  const [showComplaintHistory, setShowComplaintHistory] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    description: '',
  });
 

  const [addComplaint] = useMutation(ADD_COMPLAINT, {
    onCompleted: () => {
      setNewComplaint({ description: '' });
      closeDialog();
    },
    onError: (error) => console.error('Error adding complaint:', error.message),
    refetchQueries: [{ query: GET_COMPLAINTS_BY_USERID }],
  });


  if (loading) return <LoaderSpinner />;
  if (error) return <p>Error: {error.message}</p>;

  const openDialog = () => setShowDialog(true);
  const closeDialog = () => {
    setShowDialog(false);
    setShowComplaintHistory(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComplaint({ ...newComplaint, [name]: value });
  };


  const onHistory = (rowData) => {
    const { id } = rowData;

    fetchComplaintById({
      variables: { complaintId: id },
      onCompleted: () => setShowComplaintHistory(true),
      onError: (error) => console.error('Error fetching complaint by ID:', error.message),
    });
  };

  const ActionBodyTemplate = (rowData) => (
    <>
      <FaHistory size={40} onClick={() => onHistory(rowData)} style={{ cursor: 'pointer' }} />
    </>

  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const complaintInput = {
      description: newComplaint.description,
      user_id: 1,
      assigned_officer_id: 1,
      status_id: 1,
    };
    addComplaint({ variables: { complaint: complaintInput } });
  };

  return (
    <div className='complaint-container'  style={{height:"90vh"}}>
      <div className="flex justify-content-between mb-5 mt-5" style={{width:"80vw"}}>
        <h2 className="text-5xl font-bold text-white" >My Complaints</h2>
        <Button label="Add Complaint" icon="pi pi-plus" onClick={openDialog}
          style={{ backgroundColor: '#2c3e50', color: 'white', border: '2px solid #2c3e50', padding: '10px 20px', borderRadius: '5px', fontSize: '14px', fontWeight: 'bold', transition: 'background-color 0.3s, border-color 0.3s', }}/>

      </div>

      <DataTable value={data.getComplaintById} paginator rows={8} stripedRows responsiveLayout="scroll" className="shadow-2 rounded-md custom-table" style={{ width: "80vw" }}>
        <Column field="description" header="Complaint" sortable></Column>
        {/* <Column field="user.name" header="complaintCreatedBy" sortable></Column> */}
        <Column field="assignedOfficer.name" header="AssignedTo" sortable></Column>
        <Column field="status.name" header="Status" sortable></Column>
        <Column field="created_at" header="Created Date" sortable></Column>
        <Column field="updated_at" header="UpdatedAt" sortable></Column>
        <Column body={ActionBodyTemplate} header="Actions" sortable></Column>
      </DataTable>

      <Dialog header={<h3 className="dialog-title">Add Complaint</h3>} visible={showDialog} style={{ width: '40vw' }} modal onHide={closeDialog} className="custom-dialog"
        footer={
          <div className="dialog-footer">
            {/* <Button label="Cancel" icon="pi pi-times" className="cancel-button" onClick={closeDialog} />
            <Button label="Save" icon="pi pi-check" className="save-button" onClick={handleSubmit} /> */}
            <Button label="Cancel" icon="pi pi-times" onClick={closeDialog} className="btn btn-outline-danger mx-2"/>
            <Button label="Save" icon="pi pi-check" onClick={handleSubmit} className="btn btn-primary"/>
          </div>
        }
      >
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="description">Description:</label>
            <InputText id="description" name="description" value={newComplaint.description} onChange={handleInputChange} />
          </div>
        </div>
      </Dialog>

      <Dialog header={<h3 className="dialog-title">Complaint Details</h3>}
        visible={showComplaintHistory} style={{ width: '80vw' }} modal onHide={closeDialog} className="custom-dialog">
        {historyLoading ? (
          <p>Loading complaint details...</p>
        ) : historyError ? (
          <p>Error loading details: {historyError.message}</p>
        ) : (
          getAuditLog && getAuditLog.getAuditLog && getAuditLog.getAuditLog.length > 0 ? (
            <div>
              <DataTable value={getAuditLog.getAuditLog} paginator rows={8} stripedRows responsiveLayout="scroll" className="shadow-2 rounded-md">
                <Column field="complaint.description" header="Complaint" sortable />
                <Column field="action" header="Action" sortable />
                <Column field="performedBy.name" header="Performed By(Officer)" sortable />
                <Column field="details" header="Details" sortable />
                {/* <Column body={ActionBodyTemplate} header="Actions" sortable /> */}
              </DataTable>
            </div>
          ) : (
            <p>No audit logs found for this complaint.</p>
          )
        )}
      </Dialog>

    </div>
  );
};

export default Mycomplaints;

