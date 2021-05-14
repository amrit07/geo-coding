import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export default function DistanceForm() {
  const [file, setFile] = useState(null);

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setFile(i);
    }
  };

  const uploadToServer = async (event) => {
    const body = new FormData();
    body.append('file', file);
    const response = await fetch('/api/distance', {
      method: 'POST',
      body,
    });
    const data = await response.text();
    const blob = new Blob([data], { type: 'data:text/csv;charset=utf-8,' });
    const blobURL = window.URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.download = 'Distance.csv';
    anchor.href = blobURL;
    anchor.dataset.downloadurl = [
      'text/csv',
      anchor.download,
      anchor.href,
    ].join(':');
    anchor.click();
    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      URL.revokeObjectURL(blobURL);
    }, 100);
  };

  return (
    <Grid container spacing={3} alignItems="flex-end">
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="file"
          name="file"
          label="Upload CSV"
          fullWidth
          type="file"
          name="file"
          size="small"
          onChange={uploadToClient}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button
          variant="contained"
          color="primary"
          onClick={uploadToServer}
          disabled={!file}
        >
          Get Distance
        </Button>
      </Grid>
    </Grid>
  );
}
