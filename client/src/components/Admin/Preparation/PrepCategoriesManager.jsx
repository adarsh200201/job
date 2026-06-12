import React, { useState, useEffect } from 'react';
import api from '../../../api/index.js';

export default function PrepCategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const catRes = await api.get('/preparation/admin/categories');
      if (catRes.data?.success) setCategories(catRes.data.categories || []);

      const subRes = await api.get('/preparation/admin/subcategories');
      if (subRes.data?.success) setSubcategories(subRes.data.subcategories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <div className="p-5 text-center text-muted">⏳ Loading categories & subcategories...</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#162c4a', margin: 0 }}>
          🏷️ Categories & Sub Categories
        </h2>
        <p className="text-muted mb-0 small">Overview of question categories and sub-topics structure</p>
      </div>

      <div className="row g-4">
        {/* Categories Table */}
        <div className="col-12 col-md-5">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
            <div className="card-header bg-light border-bottom p-3">
              <h5 className="m-0" style={{ fontWeight: 800, color: '#162c4a' }}>📁 Categories</h5>
            </div>
            {categories.length === 0 ? (
              <div className="p-4 text-center text-muted">No categories populated yet.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <tr>
                      <th style={{ paddingLeft: '1.25rem' }}>Category Name</th>
                      <th style={{ textAlign: 'right', paddingRight: '1.25rem' }}>Question Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ paddingLeft: '1.25rem', fontWeight: 700, color: '#162c4a' }}>{cat.name}</td>
                        <td style={{ textAlign: 'right', paddingRight: '1.25rem' }}>
                          <span className="badge bg-primary-subtle text-primary" style={{ fontSize: '0.85rem' }}>
                            {cat.count} Questions
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Subcategories Table */}
        <div className="col-12 col-md-7">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
            <div className="card-header bg-light border-bottom p-3">
              <h5 className="m-0" style={{ fontWeight: 800, color: '#162c4a' }}>🏷️ Sub Categories (Topics)</h5>
            </div>
            {subcategories.length === 0 ? (
              <div className="p-4 text-center text-muted">No subcategories populated yet.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <tr>
                      <th style={{ paddingLeft: '1.25rem' }}>Sub Category</th>
                      <th>Parent Category</th>
                      <th style={{ textAlign: 'right', paddingRight: '1.25rem' }}>Question Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subcategories.map((sub, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ paddingLeft: '1.25rem', fontWeight: 700, color: '#162c4a' }}>{sub.name}</td>
                        <td><span className="badge bg-light text-dark border">{sub.category}</span></td>
                        <td style={{ textAlign: 'right', paddingRight: '1.25rem' }}>
                          <span className="badge bg-secondary-subtle text-secondary" style={{ fontSize: '0.85rem' }}>
                            {sub.count} Questions
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
