import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

const GET_COMPLAINTS = gql`
  query {
    getComplaints {
      id
      complaint_name
      resolved_by
      resolution_note
      resolved_at
      status
    }
  }
`;

const UPDATE_RESOLUTION = gql`
  mutation updateResolution($id: ID!, $resolved_by: ID!, $resolution_note: String!, $status: String!) {
    updateResolution(id: $id, resolved_by: $resolved_by, resolution_note: $resolution_note, status: $status) {
      id
      complaint_name
      resolved_by
      resolution_note
      resolved_at
      status
    }
  }
`;

const INSERT_AUDIT = gql`
  mutation insertAudit($complaintId: ID!, $resolved_by: ID!, $action: String!) {
    insertAudit(complaintId: $complaintId, resolved_by: $resolved_by, action: $action) {
      id
      complaintId
      resolved_by
      action
      created_at
    }
  }
`;

const GET_RESOLUTIONS = gql`
  query GetResolutions {
    getResolutions {
      id
      resolution_note
      resolvedBy {
        name
        email
      }
      resolved_at
    }
  }
`;

const Resolution = () => {

  const [updateResolution] = useMutation(UPDATE_RESOLUTION);
  const { loading, error, data } = useQuery(GET_RESOLUTIONS);
  const [insertAudit] = useMutation(INSERT_AUDIT);
  
  const [showDialog, setShowDialog] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [status, setStatus] = useState('');


  const openDialog = (complaint) => {
    setSelectedComplaint(complaint);
    setResolutionNote(complaint.resolution_note || '');
    setStatus(complaint.status);
    setShowDialog(true);
  };

  const closeDialog = () => setShowDialog(false);

  const handleSubmit = async () => {
    const { id } = selectedComplaint;

    // Update the resolution
    await updateResolution({
      variables: {
        id,
        resolved_by: 4,
        resolution_note: resolutionNote,
        status
      }
    });

    // Insert an audit record
    await insertAudit({
      variables: {
        complaintId: id,
        resolved_by: 4,
        action: 'Resolution updated'
      }
    });

    closeDialog();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-4">
      <h2>Resolution</h2>
      <DataTable value={data.getResolutions} paginator rows={10}>
        <Column field="resolution_note" header="Compalint" />
        <Column field="resolved_at" header="Resolved At" />
        <Column field="resolvedBy.name" header="Resolved By" />
        <Column header="Action" body={(rowData) => ( <Button label="Resolve" icon="pi pi-pencil" onClick={() => openDialog(rowData)} />)}/>
      </DataTable>

      <Dialog header="Update Resolution" visible={showDialog} onHide={closeDialog}
        footer={
          <div>
            <Button label="Cancel" icon="pi pi-times" onClick={closeDialog} />
            <Button label="Save" icon="pi pi-check" onClick={handleSubmit} />
          </div>
        }
        style={{ width: '50vw' }}
      >

        <div className="form-group">
          <label htmlFor="resolutionNote">Resolution Note:</label>
          <InputText id="resolutionNote" value={resolutionNote} onChange={(e) => setResolutionNote(e.target.value)} placeholder="Enter resolution note"/>
        </div>
        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <InputText id="status" value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Enter resolution status"/>
        </div>
      </Dialog>
    </div>
  );
};

export default Resolution;
