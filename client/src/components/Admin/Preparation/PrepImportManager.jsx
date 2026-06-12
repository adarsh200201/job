import React, { useState } from 'react';
import api from '../../../api/index.js';

export default function PrepImportManager() {
  const [fileContent, setFileContent] = useState(null);
  const [fileObject, setFileObject] = useState(null);
  const [fileType, setFileType] = useState(''); // 'json' or 'excel'
  const [fileName, setFileName] = useState('');
  const [validationError, setValidationError] = useState('');
  const [importSummary, setImportSummary] = useState(null);
  const [importErrors, setImportErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setValidationError('');
    setImportSummary(null);
    setImportErrors([]);
    setFileObject(file);

    if (file.name.endsWith('.json')) {
      setFileType('json');
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target.result);
          if (!Array.isArray(json)) {
            setValidationError('⚠️ Invalid format: JSON must be an array of questions.');
            setFileContent(null);
            return;
          }
          
          const first = json[0];
          if (first && !first.question && !first.questionText) {
            setValidationError('⚠️ Invalid schema: Each question must contain a "question" or "questionText" field.');
            setFileContent(null);
            return;
          }

          setFileContent(json);
        } catch (err) {
          setValidationError('⚠️ Parsing failed: Invalid JSON file.');
          setFileContent(null);
        }
      };
      reader.readAsText(file);
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      setFileType('excel');
      setFileContent(true); // Treat as valid for uploading, let server validate
    } else {
      setValidationError('⚠️ Unsupported file format. Only JSON (.json) or Excel (.xlsx/.xls) files are allowed.');
      setFileContent(null);
      setFileObject(null);
      setFileName('');
    }
  };

  const handleImport = async () => {
    if (!fileContent) return;
    setLoading(true);
    setImportSummary(null);
    setImportErrors([]);
    try {
      let res;
      if (fileType === 'json') {
        res = await api.post('/preparation/admin/questions/bulk-import', { questions: fileContent });
      } else {
        const formData = new FormData();
        formData.append('file', fileObject);
        res = await api.post('/preparation/admin/questions/excel-import', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (res.data?.success) {
        setImportSummary(res.data.summary);
        setImportErrors(res.data.errors || []);
        // Reset file state
        setFileContent(null);
        setFileObject(null);
        setFileName('');
      }
    } catch (err) {
      alert('Import failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#162c4a', margin: 0 }}>
          📤 Bulk Import Questions
        </h2>
        <p className="text-muted mb-0 small">Import questions using JSON or Excel spreadsheets (.xlsx) dynamically.</p>
      </div>

      <div className="row g-3">
        {/* Upload Card */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: '12px', background: '#fff', border: '2px dashed #cbd5e1' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📄</div>
            <h5 style={{ fontWeight: 700, color: '#162c4a' }}>Upload File (JSON or Excel)</h5>
            <p className="text-muted small">Select a .json file or a spreadsheet (.xlsx/.xls) containing your question bank. Duplicates will be automatically skipped.</p>
            
            <input
              type="file"
              id="prep-file-input"
              className="d-none"
              accept=".json,.xlsx,.xls"
              onChange={handleFileChange}
            />
            <label
              htmlFor="prep-file-input"
              className="btn btn-outline-dark mx-auto"
              style={{ cursor: 'pointer', fontWeight: 600, padding: '0.6rem 1.5rem', borderRadius: '8px' }}
            >
              📂 Select Question File
            </label>

            {fileName && (
              <div className="mt-3 py-2 px-3 bg-light border rounded d-flex align-items-center justify-content-between">
                <span className="small text-truncate" style={{ fontWeight: 600 }}>📎 {fileName} {fileType === 'json' && `(${fileContent?.length || 0} records)`}</span>
                <button className="btn btn-sm btn-link text-danger p-0" onClick={() => { setFileName(''); setFileContent(null); setFileObject(null); }}>Remove</button>
              </div>
            )}

            {validationError && (
              <div className="alert alert-danger py-2 mt-3 mb-0 small" style={{ borderRadius: '8px' }}>
                {validationError}
              </div>
            )}

            {fileContent && (
              <button
                className="btn btn-primary w-100 mt-4"
                style={{ padding: '0.75rem', fontWeight: 700, borderRadius: '8px', background: 'linear-gradient(90deg, #1677b6, #2a9df4)', border: 'none' }}
                onClick={handleImport}
                disabled={loading}
              >
                {loading ? '⏳ Importing Questions...' : '🚀 Start Import'}
              </button>
            )}
          </div>
        </div>

        {/* Results / Help Column */}
        <div className="col-12 col-lg-6">
          {importSummary ? (
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '12px', background: '#fff' }}>
              <h5 style={{ fontWeight: 800, color: '#162c4a', marginBottom: '1.25rem' }}>✅ Import Summary</h5>
              
              <div className="row g-2 mb-4">
                {[
                  { label: 'Total Records', value: importSummary.total, bg: '#f8fafc', color: '#475569' },
                  { label: 'Imported', value: importSummary.imported, bg: '#f0fdf4', color: '#166534' },
                  { label: 'Skipped (Duplicate)', value: importSummary.skipped, bg: '#fffbeb', color: '#d97706' },
                  { label: 'Failed', value: importSummary.failed, bg: '#fef2f2', color: '#991b1b' }
                ].map((stat, i) => (
                  <div key={i} className="col-6">
                    <div style={{ background: stat.bg, padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                      <div className="small text-muted" style={{ fontWeight: 600 }}>{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {importErrors.length > 0 && (
                <div>
                  <h6 style={{ fontWeight: 700, color: '#991b1b', marginBottom: '8px' }}>⚠️ Import Errors / Warnings:</h6>
                  <div className="p-3 bg-light border rounded" style={{ maxHeight: '180px', overflowY: 'auto', fontSize: '0.8rem', fontFamily: 'SFMono-Medium,Consolas,monospace', color: '#991b1b' }}>
                    {importErrors.map((err, i) => <div key={i} className="mb-1">• {err}</div>)}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '12px', background: '#fff' }}>
              <h5 style={{ fontWeight: 800, color: '#162c4a', marginBottom: '1rem' }}>📋 Excel / JSON Format Reference</h5>
              <p className="text-muted small">Excel files should have the following headers (case insensitive):</p>
              
              <div style={{ maxHeight: '280px', overflowY: 'auto', fontSize: '0.85rem' }}>
                <table className="table table-bordered table-sm small">
                  <thead>
                    <tr className="table-light">
                      <th>Header Name</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>Category</code></td>
                      <td>Placement category name (e.g. Quantitative Aptitude)</td>
                    </tr>
                    <tr>
                      <td><code>SubCategory</code></td>
                      <td>Topic parent subcategory (e.g. Arithmetic)</td>
                    </tr>
                    <tr>
                      <td><code>Topic</code></td>
                      <td>Question specific topic name (e.g. HCF and LCM)</td>
                    </tr>
                    <tr>
                      <td><code>Question</code></td>
                      <td>The actual question text (Markdown supported)</td>
                    </tr>
                    <tr>
                      <td><code>OptionA, OptionB...</code></td>
                      <td>Individual options (minimum 2 options are required)</td>
                    </tr>
                    <tr>
                      <td><code>CorrectAnswer</code></td>
                      <td>Correct answer text or label (e.g. "A" or the exact option text)</td>
                    </tr>
                    <tr>
                      <td><code>Explanation</code></td>
                      <td>Detailed step-by-step resolution path</td>
                    </tr>
                    <tr>
                      <td><code>Difficulty</code></td>
                      <td>Easy, Medium, or Hard</td>
                    </tr>
                    <tr>
                      <td><code>Company</code></td>
                      <td>Recruiter name (Optional, e.g. TCS NQT)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
