import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css'; // Ensure you have this CSS file for styling
const NotFoundPage = () => {
  return (
    <div className="airbnb-not-found-container">
      <div className="airbnb-not-found-content">
        <div className="airbnb-not-found-logo">
          {/* You can replace this with your own logo */}
          <svg width="30" height="32" fill="#222" viewBox="0 0 32 32">
            <path d="M16 0c-5.9 0-10.7 4.8-10.7 10.7 0 5.4 4.3 9.9 9.7 10.6v10.7h2V21.3c5.4-.7 9.7-5.2 9.7-10.6C26.7 4.8 21.9 0 16 0zm0 19.3c-4.7 0-8.6-3.9-8.6-8.6S11.3 2.1 16 2.1s8.6 3.9 8.6 8.6-3.9 8.6-8.6 8.6z" />
          </svg>
        </div>

        <div className="airbnb-not-found-main">
          <div className="airbnb-not-found-text">
            <h1>Oops!</h1>
            <p className="airbnb-not-found-message">Có vẻ như chúng tôi không tìm thấy trang bạn đang tìm kiếm.</p>
            <p className="airbnb-not-found-error-code">Mã lỗi: 404</p>
          </div>

          <div className="airbnb-not-found-illustration">
            {/* SVG Illustration similar to Airbnb's */}
            <svg width="180" height="220" viewBox="0 0 180 220">
              <g transform="translate(10,10)">
                {/* Character Body */}
                <rect x="40" y="60" width="60" height="80" fill="#1A9CB0" rx="5" />
                <rect x="40" y="125" width="60" height="15" fill="#157A8C" rx="2" />

                {/* Head */}
                <circle cx="70" cy="40" r="30" fill="#FFB6B0" />

                {/* Hair */}
                <path
                  d="M70 10 Q85 15 80 30 Q90 25 90 40 L90 45 Q70 48 50 45 L50 40 Q50 25 60 30 Q55 15 70 10"
                  fill="#157A8C"
                />

                {/* Eyes */}
                <ellipse cx="60" cy="35" rx="4" ry="3" fill="#333" />
                <ellipse cx="80" cy="35" rx="4" ry="3" fill="#333" />

                {/* Mouth */}
                <path d="M60 50 Q70 60 80 50" stroke="#333" strokeWidth="2" fill="none" />

                {/* Arms */}
                <rect x="20" y="70" width="20" height="50" fill="#1A9CB0" rx="5" />
                <rect x="100" y="70" width="20" height="50" fill="#1A9CB0" rx="5" />

                {/* Legs */}
                <rect x="50" y="140" width="15" height="40" fill="#157A8C" rx="3" />
                <rect x="75" y="140" width="15" height="40" fill="#157A8C" rx="3" />

                {/* Feet */}
                <rect x="45" y="180" width="25" height="10" fill="#333" rx="5" />
                <rect x="70" y="180" width="25" height="10" fill="#333" rx="5" />

                {/* Paper/Map in hand */}
                <polygon points="115,80 135,90 125,110 105,100" fill="#FFC857" />

                {/* Red puddle */}
                <ellipse cx="130" cy="190" rx="30" ry="10" fill="#FF5A5F" opacity="0.8" />
              </g>
            </svg>
          </div>
        </div>

        <div className="airbnb-not-found-links">
          <p className="airbnb-not-found-help-text">Sau đây là một số liên kết hữu ích thay thế:</p>
          <ul className="airbnb-not-found-link-list">
            <li>
              <Link to="/dashboard">Tổng quan</Link>
            </li>
            <li>
              <Link to="/employees">Danh sách nhân viên</Link>
            </li>
            <li>
              <Link to="/help">Trợ giúp</Link>
            </li>
            <li>
              <Link to="/accounts">Tài khoản</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
