import React, { useState, useRef, useEffect } from "react";
import { getDepartments } from "~/services/departmentService";
import { getEmployees } from "~/services/employeeService";
import { uploadVideo } from "~/services/videoService";
import ButtonBack from "~/components/ButtonBack/ButtonBack";
import "./FaceTraining.css";

const FaceTraining = () => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [departments, setDepartments] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stream, setStream] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const departmentsData = await getDepartments();
        setDepartments(departmentsData || []);
        const employeesData = await getEmployees();
        setAllEmployees(employeesData || []);
        setFilteredEmployees(employeesData || []);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    let timer;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      stopRecording();
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const startRecording = async () => {
    if (!selectedEmployee) {
      setUploadStatus({ type: "error", message: "Vui lòng chọn nhân viên trước khi quay video" });
      return;
    }

    try {
      setUploadStatus(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      setStream(mediaStream);
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play();

      const recorder = new MediaRecorder(mediaStream);
      const chunks = [];

      recorder.ondataavailable = (event) => chunks.push(event.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setVideoBlob(blob);
        const url = URL.createObjectURL(blob);
        setVideoURL(url);
      };

      setCountdown(5);
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
    } catch (error) {
      console.error("Không thể mở camera:", error);
      setUploadStatus({ type: "error", message: "Không thể mở camera. Vui lòng kiểm tra quyền truy cập camera của bạn." });
    }
  };

  const stopRecording = () => {
    setCountdown(null);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const handleUpload = async () => {
    if (!videoBlob) return;

    try {
      setUploadStatus({ type: "loading", message: "Đang tải video lên..." });
      // Tạo file từ Blob với tên file .mp4
      const file = new File([videoBlob], "face_training.mp4", {
        type: "video/mp4",
      });

      const response = await uploadVideo(file, selectedEmployee);
      setUploadStatus({ type: "success", message: "Tải video lên thành công!" });
      console.log("📥 Response từ server:", response);
    } catch (error) {
      setUploadStatus({ type: "error", message: "Lỗi khi tải video lên. Vui lòng thử lại." });
      console.error("⚠️ Chi tiết lỗi:", error);

      if (error.response) {
        console.error("📥 Response từ server:", error.response.data);
      } else if (error.request) {
        console.error("⚠️ Không nhận được phản hồi từ server!");
      } else {
        console.error("🛠️ Lỗi khi cấu hình request:", error.message);
      }
    }
  };

  const resetRecording = () => {
    setVideoURL(null);
    setVideoBlob(null);
    setUploadStatus(null);
  };

  const getEmployeeName = () => {
    if (!selectedEmployee) return "";
    const employee = filteredEmployees.find(emp => emp.userId.toString() === selectedEmployee.toString());
    return employee ? employee.fullName : "";
  };

  return (
    <div className="face-training-container container py-4">
      {loading ? (
        <div className="d-flex flex-column align-items-center justify-content-center min-vh-50">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="text-center fw-medium">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold m-0">Huấn luyện khuôn mặt</h2>
            <ButtonBack />
          </div>

          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h5 className="card-title mb-3">Thông tin nhân viên</h5>
                  
                  <div className="mb-3">
                    <label className="form-label fw-medium">Chọn phòng ban:</label>
                    <select
                      onChange={(e) => {
                        setSelectedDepartment(e.target.value);
                        setSelectedEmployee("");
                        setFilteredEmployees(
                          e.target.value
                            ? allEmployees.filter(
                                (emp) =>
                                  emp.department.departmentId.toString() ===
                                  e.target.value.toString()
                              )
                            : allEmployees
                        );
                      }}
                      className="form-select"
                      value={selectedDepartment}
                    >
                      <option value="">-- Chọn phòng ban --</option>
                      {departments.map((dept) => (
                        <option key={dept.departmentId} value={dept.departmentId}>
                          {dept.departmentName}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-medium">Chọn nhân viên:</label>
                    <select
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      className="form-select"
                      value={selectedEmployee}
                      disabled={!selectedDepartment}
                    >
                      <option value="">-- Chọn nhân viên --</option>
                      {filteredEmployees.map((emp) => (
                        <option key={emp.userId} value={emp.userId}>
                          {emp.fullName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-4">
                    <h5 className="card-title mb-3">Quay video khuôn mặt</h5>
                    
                    <div className="video-container position-relative mb-3 bg-light rounded overflow-hidden" style={{ aspectRatio: "4/3" }}>
                      {recording && countdown !== null && (
                        <div className="position-absolute top-50 start-50 translate-middle bg-dark bg-opacity-50 rounded-circle d-flex align-items-center justify-content-center" style={{ width: "80px", height: "80px", zIndex: 10 }}>
                          <span className="text-white fs-1 fw-bold">{countdown}</span>
                        </div>
                      )}
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className="w-100 h-100 bg-dark"
                        style={{ objectFit: "cover" }}
                      ></video>
                      {!videoRef.current?.srcObject && !recording && (
                        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center">
                          <i className="bi bi-camera-video fs-1 text-secondary mb-2"></i>
                          <p className="text-secondary">Nhấn "Bắt đầu quay" để kích hoạt camera</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="d-flex gap-2">
                      {!recording ? (
                        <button 
                          className="btn btn-primary px-4" 
                          onClick={startRecording}
                          disabled={!selectedEmployee}
                        >
                          <i className="bi bi-record-circle me-2"></i>
                          Bắt đầu quay
                        </button>
                      ) : (
                        <button className="btn btn-danger px-4" onClick={stopRecording}>
                          <i className="bi bi-stop-circle me-2"></i>
                          Dừng quay
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h5 className="card-title mb-3">Xem trước & Huấn luyện</h5>
                  
                  {videoURL ? (
                    <div className="video-preview">
                      <div className="mb-3">
                        {selectedEmployee && (
                          <div className="alert alert-info">
                            <strong>Nhân viên:</strong> {getEmployeeName()}
                          </div>
                        )}
                      </div>
                      
                      <div className="rounded overflow-hidden mb-3 bg-light" style={{ aspectRatio: "4/3" }}>
                        <video
                          src={videoURL}
                          controls
                          className="w-100 h-100"
                          style={{ objectFit: "cover" }}
                        ></video>
                      </div>
                      
                      {uploadStatus && (
                        <div className={`alert alert-${uploadStatus.type === 'success' ? 'success' : uploadStatus.type === 'error' ? 'danger' : 'info'} d-flex align-items-center`}>
                          {uploadStatus.type === 'loading' && <div className="spinner-border spinner-border-sm me-2" role="status"></div>}
                          {uploadStatus.type === 'success' && <i className="bi bi-check-circle-fill me-2"></i>}
                          {uploadStatus.type === 'error' && <i className="bi bi-exclamation-triangle-fill me-2"></i>}
                          {uploadStatus.message}
                        </div>
                      )}
                      
                      <div className="d-flex gap-2">
                        <button 
                          onClick={handleUpload} 
                          className="btn btn-success"
                          disabled={uploadStatus?.type === 'loading' || !selectedEmployee}
                        >
                          <i className="bi bi-cloud-arrow-up me-2"></i>
                          Huấn luyện khuôn mặt
                        </button>
                        <button onClick={resetRecording} className="btn btn-outline-secondary">
                          <i className="bi bi-arrow-counterclockwise me-2"></i>
                          Quay lại
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex flex-column align-items-center justify-content-center p-5">
                      <div className="text-center mb-3">
                        <i className="bi bi-file-earmark-play text-secondary" style={{ fontSize: "4rem" }}></i>
                      </div>
                      <p className="text-center text-secondary">
                        Quay video khuôn mặt ở phía bên trái để xem trước tại đây
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FaceTraining;