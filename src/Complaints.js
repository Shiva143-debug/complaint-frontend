import React, { useState } from 'react';
import { useQuery, gql, useMutation, useLazyQuery } from '@apollo/client';
import { Dropdown } from 'primereact/dropdown';
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
const GET_COMPLAINTS = gql`
  query  {
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

const GET_STATUSES = gql`
  query {
  getStatuses {
    id
    name
  }
  }
`;

const INSERT_AUDIT = gql`
  mutation addAudit($audit: AddAuditInput!) {
    addAudit(audit: $audit) {
      action     
    }
  }
`;

const UPDATE_RESOLUTION = gql`
 mutation updateResolution($resolution: UpdateResolutionInput!){
  updateResolution(resolution: $resolution) {
    resolution_note
  }
 }
  

`

const UPDATE_COMPLAINT = gql`
 mutation up($complaint: UpdatecomplaintInput!){
  updateComplaint(complaint: $complaint) {
    status_id
  }
}
 `
  ;


const Complaints = () => {
  const { loading, error, data } = useQuery(GET_COMPLAINTS);
  const { data: statusData } = useQuery(GET_STATUSES);
  const [fetchComplaintById, { data: getAuditLog, loading: historyLoading, error: historyError }] = useLazyQuery(GET_HISTORY);
  const [showDialog, setShowDialog] = useState(false);
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [showComplaintHistory, setShowComplaintHistory] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    description: '',
  });
  const [resolutionNote, setResolutionNote] = useState("")
  const [statusId, setStatusId] = useState(null)
  const [selectedComplaint, setSelectedComplaint] = useState(null);


  const statusOptions = statusData ? statusData.getStatuses.map(status => ({
    label: status.name,
    value: status.id
  })) : [];


  const [addComplaint] = useMutation(ADD_COMPLAINT, {
    onCompleted: () => {
      setNewComplaint({ description: '' });
      closeDialog();
    },
    onError: (error) => console.error('Error adding complaint:', error.message),
    refetchQueries: [{ query: GET_COMPLAINTS }],
  });

  const [addAudit] = useMutation(INSERT_AUDIT, {
    onCompleted: () => {
      closeDialog();
    },
    onError: (error) => console.error('Error adding audit log:', error.message),
    refetchQueries: [{ query: GET_COMPLAINTS }],
  });

  const [updateComplaint] = useMutation(UPDATE_COMPLAINT, {
    onCompleted: () => {
      closeDialog();
    },
    onError: (error) => console.error('Error update complaint:', error.message),
    refetchQueries: [{ query: GET_COMPLAINTS }],
  });

  const [updateResolution] = useMutation(UPDATE_RESOLUTION, {
    onCompleted: () => {
      closeDialog();
    },
    onError: (error) => console.error('Error update resolution:', error.message),
    refetchQueries: [{ query: GET_COMPLAINTS }],
  });

  if (loading) return <LoaderSpinner />;
  if (error) return <p>Error: {error.message}</p>;

  const openDialog = () => setShowDialog(true);
  const closeDialog = () => {
    setShowDialog(false);
    setShowComplaintHistory(false);
    setShowResolveDialog(false)
  };

  const openResolveDialog = (complaint) => {
    setShowResolveDialog(true);
    setSelectedComplaint(complaint)
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
      <Button label="Resolve" icon="pi pi-pencil" onClick={() => openResolveDialog(rowData)} className='mx-2' />
    </>

  );

  const handleDropdownChange = (e) => {
    setStatusId(e.target.value);
  };

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


  const handleResolveSubmit = async (e) => {
    e.preventDefault()
    const { id } = selectedComplaint;
    const auditInput = { complaint_id: parseInt(id), performed_by: 4, action: 'Resolution updated', details: resolutionNote };
    const updateResolutionInput = { id: parseInt(id), resolved_by: 4, resolution_note: resolutionNote }
    const updateComplaintInput = { id: parseInt(id), status_id: statusId }
    await addAudit({ variables: { audit: auditInput } });
    await updateResolution({ variables: { resolution: updateResolutionInput } });
    await updateComplaint({ variables: { complaint: updateComplaintInput } });
  }


  return (
    <div className='complaint-container' style={{height:"90vh"}}>
       <div className="flex justify-content-between mb-5 mt-5" style={{width:"80vw"}}>
       <h2 className="text-5xl font-bold text-white" >Complaints</h2>
        <Button label="Add Complaint" icon="pi pi-plus" onClick={openDialog}
          style={{ backgroundColor: '#2c3e50', color: 'white', border: '2px solid #2c3e50', padding: '10px 20px', borderRadius: '5px', fontSize: '14px', fontWeight: 'bold', transition: 'background-color 0.3s, border-color 0.3s', }}
          onFocus={(e) => {
            e.target.style.boxShadow = '0 0 5px rgba(44, 62, 80, 0.5)';
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = 'none';
          }}
        />

      </div>

      <DataTable value={data.getComplaints} paginator rows={6} stripedRows responsiveLayout="scroll" className="shadow-2 rounded-md custom-table" style={{ width: "80vw" }}>
        <Column field="description" header="Complaint" sortable></Column>
        <Column field="user.name" header="complaintCreatedBy" sortable></Column>
        <Column field="assignedOfficer.name" header="AssignedTo" sortable></Column>
        <Column field="status.name" header="Status" sortable></Column>
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

      {/* <Dialog header={`Resolve Complaint (ID: ${selectedComplaint?.id})`} visible={showResolveDialog} onHide={closeDialog}
        footer={
          <div>
            <Button label="Cancel" icon="pi pi-times" onClick={closeDialog} />
            <Button label="Save" icon="pi pi-check" onClick={handleResolveSubmit} />
          </div>
        }
        style={{ width: '50vw' }}
      >
        {selectedComplaint && (
          <div className="form-group">
            <label htmlFor="complaint">Complaint:</label>
            <InputText id="complaint" value={selectedComplaint.description} readOnly />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="resolutionNote">Resolution Note:</label>
          <InputText id="resolutionNote" value={resolutionNote} onChange={(e) => setResolutionNote(e.target.value)} placeholder="Enter resolution note" />
        </div>
        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <Dropdown id="status" options={statusOptions} value={statusId} onChange={handleDropdownChange} placeholder="Select resolution status" />
        </div>

      </Dialog> */}

      <Dialog
        header={`Resolve Complaint (ID: ${selectedComplaint?.id})`}
        visible={showResolveDialog}
        onHide={closeDialog}
        footer={
          <div className="d-flex justify-content-end gap-2">
            <Button label="Cancel" icon="pi pi-times" onClick={closeDialog} className="btn btn-outline-danger"/>
            <Button label="Save" icon="pi pi-check" onClick={handleResolveSubmit} className="btn btn-primary"/>
          </div>
        }
        style={{ width: "50vw" }}
      >
        {selectedComplaint && (
          <div className="d-flex align-items-center mb-3">
            <label htmlFor="complaint" className="form-label fw-bold me-3" style={{ width: "30%" }}>
              Complaint:
            </label>
            <InputText
              id="complaint"
              value={selectedComplaint.description}
              readOnly
              className="form-control flex-grow-1"
            />
          </div>
        )}

        <div className="d-flex align-items-center mb-3">
          <label htmlFor="resolutionNote" className="form-label fw-bold me-3" style={{ width: "30%" }}>
            Resolution Note:
          </label>
          <InputText
            id="resolutionNote"
            value={resolutionNote}
            onChange={(e) => setResolutionNote(e.target.value)}
            placeholder="Enter resolution note"
            className="form-control flex-grow-1"
          />
        </div>

        <div className="d-flex align-items-center mb-3">
          <label htmlFor="status" className="form-label fw-bold me-3" style={{ width: "30%" }}>
            Status:
          </label>
          <Dropdown
            id="status"
            options={statusOptions}
            value={statusId}
            onChange={handleDropdownChange}
            placeholder="Select resolution status"
            className="form-select "
          />
        </div>
      </Dialog>

    </div>
  );
};

export default Complaints;

