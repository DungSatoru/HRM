import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="not-found-page text-center">
      <h1 className="display-1 text-danger">404</h1>
      <h3 className="text-muted">Trang bạn tìm kiếm không tồn tại!</h3>
      <p className="mt-3">
        <Link to="/dashboard" className="btn btn-primary">
          Quay lại Trang chủ
        </Link>
      </p>
    </div>
  );
};

export default NotFoundPage;
