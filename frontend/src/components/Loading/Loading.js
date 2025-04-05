import './Loading.css';

function Loading() {
  return (
    <div className="loading-container">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="loading-text">Đang tải dữ liệu...</p>
    </div>
  );
}

export default Loading;
