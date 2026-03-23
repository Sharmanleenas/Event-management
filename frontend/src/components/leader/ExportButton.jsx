import React from 'react';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';

const ExportButton = ({ data, fileName }) => {
  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.warning('No data to export. Try changing the filter to "All Status".');
      return;
    }

    try {
      // Prepare rows
      const worksheetData = data.map(p => ({
        'Name': p.name || '',
        'Register Number': p.registerNumber || 'N/A',
        'Email': p.email || '',
        'Phone': p.phone || '',
        'Department': p.department || 'N/A',
        'College': p.college || 'Sacred Heart College',
        'Event Name': p.eventId?.title || 'Unknown',
        'Selected Games': p.selectedGames?.join(', ') || 'N/A',
        'Payment Status': p.paymentStatus || 'PENDING',
      }));

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

      // Use array buffer + Blob for reliable cross-browser download
      const wbBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbBuffer], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName || 'registrations'}-export.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${data.length} record(s) successfully!`);
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Export failed. Please try again.');
    }
  };

  return (
    <button
      className="btn-primary"
      onClick={handleExport}
      style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}
    >
      <span>📥</span> Export Registrations
    </button>
  );
};

export default ExportButton;
