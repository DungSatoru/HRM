import React from 'react';
import { Link } from 'react-router-dom';
import './DataTable.css';

// Component bảng tái sử dụng
const DataTable = ({
  columns,
  data,
  emptyMessage = {
    icon: 'fas fa-folder-open',
    text: 'Không có dữ liệu',
  },
  onEdit,
  onDelete,
  detailsPath,
}) => {
  return (
    <div className="table-responsive">
      <table id="DataTable" className="table table-hover table-striped">
        <thead className="table-light">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.centerAlign ? 'text-center' : ''} style={{ width: column.width }}>
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id || item[columns[0].dataIndex]}>
                {columns.map((column) => (
                  <td
                    key={`${item.id || item[columns[0].dataIndex]}-${column.key}`}
                    className={column.centerAlign ? 'text-center' : ''}
                  >
                    {renderCellContent(item, column, detailsPath, onEdit, onDelete)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center text-muted py-4">
                <i className={`${emptyMessage.icon} me-2 fa-2x`}></i>
                <p>{emptyMessage.text}</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Hàm helper để render nội dung các ô
const renderCellContent = (item, column, detailsPath, onEdit, onDelete) => {
  const value = item[column.dataIndex];

  // Nếu column có render function, sử dụng nó
  if (column.render) {
    return column.render(value, item);
  }

  // Các trường hợp đặc biệt
  switch (column.type) {
    case 'link':
      return (
        <Link to={`${detailsPath || ''}/${item.id || item[column.idField]}`} className="dataTable-link">
          {value || column.defaultValue || 'No Name'}
        </Link>
      );
    case 'badge':
      const badgeClass =
        typeof column.badgeClass === 'function'
          ? column.badgeClass(item) // truyền từng dòng vào để xử lý logic
          : column.badgeClass || 'bg-info';

      return (
        <span className={`badge ${value ? badgeClass : 'bg-secondary'}`}>
          {value || column.defaultValue}
          {/* {value || column.defaultValue || 'Chưa có'} */}
        </span>
      );
    case 'actions':
      return (
        <div className="btn-group">
          {column.showEdit && onEdit && (
            <button
              className="btn btn-sm btn-outline-primary me-2"
              onClick={() => onEdit(item.id || item[column.idField])}
              title="Sửa"
            >
              <i className="fas fa-edit"></i>
            </button>
          )}
          {column.showDelete && onDelete && (
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => onDelete(item.id || item[column.idField])}
              title="Xóa"
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          )}
        </div>
      );
    default:
      return value || column.defaultValue || '';
  }
};

export default DataTable;
