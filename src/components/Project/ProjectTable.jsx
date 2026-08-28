import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getProjects, createProject } from '../../api/project';
import AlertBox from '../common/AlertBox';
import styles from './Project.module.scss';

export default function ProjectTable() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [nameProject, setNameProject] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchProjectList = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await getProjects();
      let list = [];
      if (Array.isArray(res?.result)) {
        list = res.result;
      } else if (res?.result && typeof res.result === 'object') {
        list = [res.result];
      }

      setProjects(list);
    } catch (err) {
      console.warn('API getProjects Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectList();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!nameProject.trim()) {
      setErrorMsg('Vui lòng nhập tên dự án!');
      return;
    }

    setCreating(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await createProject({ nameProject: nameProject.trim() });
      
      const newProj = res?.result;
      if (newProj) {
        setProjects((prev) => [newProj, ...prev]);
        setSuccessMsg(`Đã tạo dự án "${newProj.nameProject || nameProject.trim()}" thành công!`);
      } else {
        setSuccessMsg(`Tạo dự án thành công!`);
        fetchProjectList();
      }
      setNameProject('');
    } catch (err) {
      console.error('API createProject error:', err);
      setErrorMsg(err.message || 'Không thể tạo dự án. Vui lòng thử lại!');
    } finally {
      setCreating(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      (p.nameProject && p.nameProject.toLowerCase().includes(q)) ||
      (p.slug && p.slug.toLowerCase().includes(q)) ||
      (p.id && p.id.toLowerCase().includes(q))
    );
  });

  return (
    <div className={styles.projectWrapper}>
      <AlertBox type="error" message={errorMsg} />
      <AlertBox type="success" message={successMsg} />

      {/* CREATE PROJECT FORM CARD */}
      <div className={styles.createCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            Tạo Dự Án Mới
          </h3>
          <span className={styles.cardBadge}>POST /projects</span>
        </div>

        <form className={styles.createForm} onSubmit={handleCreateProject}>
          <div className={styles.inputGroup}>
            <label htmlFor="nameProject">Tên dự án (nameProject) *</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              </span>
              <input
                id="nameProject"
                type="text"
                placeholder="Nhập tên dự án... (vd: Hiyori Tower)"
                value={nameProject}
                onChange={(e) => setNameProject(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={creating}>
            {creating ? (
              <>
                <span className={styles.spinner}></span>
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Thêm Dự Án</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* PROJECTS TABLE CARD */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3 className={styles.headerTitle}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
            Danh Sách Dự Án
          </h3>

          <div className={styles.actionsGroup}>
            <input
              type="text"
              placeholder="Tìm kiếm dự án..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              className={styles.refreshBtn}
              onClick={fetchProjectList}
              title="Tải lại danh sách"
              disabled={loading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}
              >
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              <span>Làm mới</span>
            </button>
          </div>
        </div>

        {/* TABLE CONTENT */}
        <div className={styles.tableResponsive}>
          <table className={styles.projectTable}>
            <thead>
              <tr>
                <th className={styles.sttCol}>STT</th>
                <th>Mã ID</th>
                <th>Tên Dự Án (nameProject)</th>
                <th>Slug</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {loading && filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="5" className={styles.emptyState}>
                    <div className={styles.spinner} style={{ margin: '0 auto 0.5rem' }}></div>
                    <p>Đang tải dữ liệu dự án từ API...</p>
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="5" className={styles.emptyState}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p>Chưa có dự án nào trong hệ thống.</p>
                  </td>
                </tr>
              ) : (
                filteredProjects.map((item, index) => (
                  <tr key={item.id || index}>
                    <td className={styles.sttCol}>{index + 1}</td>
                    <td>
                      <span className={styles.idBadge}>{item.id || `proj-${index + 1}`}</span>
                    </td>
                    <td>
                      <div className={styles.projectName}>
                        <div className={styles.projectIcon}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                          </svg>
                        </div>
                        <span>{item.nameProject}</span>
                      </div>
                    </td>
                    <td>
                      <span className={styles.slugTag}>
                        {item.slug || item.nameProject?.toLowerCase().replace(/\s+/g, '-')}
                      </span>
                    </td>
                    <td>
                      <button
                        className={styles.detailBtn}
                        onClick={() => navigate(`/vrscene/${item.id}`, { state: { project: item } })}
                        title="Xem danh sách VR Scene của dự án"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        <span>Mở chi tiết</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
