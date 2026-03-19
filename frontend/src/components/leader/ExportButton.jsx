import React from 'react';
import * as XLSX from 'xlsx';

const ExportButton = ({ data, fileName }) => {
  const handleExport = () => {
    if (!data || data.length === 0) return;

    // Prepare data for Excel
    const worksheetData = data.map(p => ({
      'Name': p.name,
      'Register Number': p.registerNumber || 'N/A',
      'Department': p.department || 'N/A',
      'College': p.college || 'Sacred Heart College',
      'Event Name': p.eventId?.title || 'Unknown',
      'Selected Games': p.selectedGames?.join(', ') || 'N/A',
      'Payment Status': p.paymentStatus
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, `${fileName}-registrations.xlsx`);
  };

  return (
    <button className="btn-primary" onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span>📥</span> Export Registrations
    </button>
  );
};

export default ExportButton;
