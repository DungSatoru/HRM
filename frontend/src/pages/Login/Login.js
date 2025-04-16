import React, { useState } from 'react';
import loginService from '~/services/loginService';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Gọi loginService để thực hiện đăng nhập
      const data = await loginService.login(username, password);

      // Sau khi đăng nhập thành công, chuyển hướng đến trang chính
      window.location.href = '/dashboard'; // Hoặc dùng `useNavigate` từ react-router-dom
    } catch (err) {
      // Xử lý lỗi khi đăng nhập
      setError('Tên đăng nhập hoặc mật khẩu không đúng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    // Xử lý logic quên mật khẩu
    console.log('Xử lý quên mật khẩu');
  };

  const handleContactAdmin = (e) => {
    e.preventDefault();
    // Xử lý logic liên hệ quản trị viên
    console.log('Liên hệ quản trị viên');
  };

  return (
    <div className="login-container h-100">
      {/* Style inline cho container chính để đảm bảo chiều cao đúng */}
      <div className="container-fluid h-100" style={{ height: '100vh', overflow: 'hidden' }}>
        <div className="row h-100">
          {/* Phần giới thiệu bên trái */}
          <div className="col-lg-6 d-none d-lg-block bg-primary text-white">
            <div className="d-flex flex-column justify-content-center px-5">
              <h1 className="display-4 fw-bold mb-4">HRM System</h1>
              <p className="fs-4 mb-5">Hệ thống quản lý nhân sự chuyên nghiệp</p>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill"></i> Quản lý thông tin nhân viên
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill"></i> Theo dõi thời gian làm việc
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill"></i> Tạo báo cáo tùy chỉnh
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill"></i> Quản lý lương và phúc lợi
                </li>
              </ul>
            </div>
          </div>

          {/* Form đăng nhập bên phải */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center bg-light h-100">
            <div className="w-100 p-4 p-md-5" style={{ maxWidth: '450px' }}>
              <div className="text-center mb-4">
                <h2 className="fw-bold fs-1 mb-2">Đăng nhập</h2>
                <p className="text-muted">Vui lòng đăng nhập để tiếp tục</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Tên đăng nhập
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-person-fill"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      placeholder="Nhập tên đăng nhập"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Mật khẩu
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock-fill"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {error && <p className="text-danger">{error}</p>}

                <div className="d-flex justify-content-between mb-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Ghi nhớ đăng nhập
                    </label>
                  </div>
                  <button
                    type="button"
                    className="btn btn-link p-0 text-decoration-none"
                    onClick={handleForgotPassword}
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                <div className="d-grid gap-2 mb-4">
                  <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Đang xử lý...
                      </>
                    ) : (
                      'Đăng nhập'
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-muted">
                    Bạn chưa có tài khoản?{' '}
                    <button
                      type="button"
                      className="btn btn-link p-0 text-decoration-none"
                      onClick={handleContactAdmin}
                    >
                      Liên hệ quản trị viên
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
