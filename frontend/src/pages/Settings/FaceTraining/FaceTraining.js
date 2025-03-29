import React, { useState, useRef, useEffect } from "react";
import "./FaceTraining.css";
import { getDepartments } from "../../../services/departmentService";
import { getEmployees } from "../../../services/employeeService";
import { uploadVideo } from "../../../services/videoService";
import ButtonBack from "../../../components/ButtonBack/ButtonBack";

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

  const startRecording = async () => {
    try {
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

      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);

      setTimeout(() => stopRecording(), 5000);
    } catch (error) {
      console.error("Không thể mở camera:", error);
    }
  };

  const stopRecording = () => {
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
      // Tạo file từ Blob với tên file .mp4
      const file = new File([videoBlob], "face_training.mp4", {
        type: "video/mp4",
      });

      console.log("📤 Đang gửi video lên server...");
      const response = await uploadVideo(file, selectedEmployee.userId);

      alert("✅ Tải video lên thành công!");
      console.log("📥 Response từ server:", response);
    } catch (error) {
      alert("❌ Lỗi khi tải video lên!");
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

  return (
    <div className="face-training-container">
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-6">
            <div className="header d-flex justify-content-between align-items-center mb-3">
              <h2>Huấn luyện khuôn mặt</h2>
              <ButtonBack />
            </div>
            <div className="form-group">
              <label>Chọn phòng ban:</label>
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
                className="form-control"
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
            <div className="form-group">
              <label>Chọn nhân viên:</label>
              <select
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="form-control"
                value={selectedEmployee}
              >
                <option value="">-- Chọn nhân viên --</option>
                {filteredEmployees.map((emp) => (
                  <option key={emp.userId} value={emp.userId}>
                    {emp.fullName}
                  </option>
                ))}
              </select>
            </div>
            <div className="video-container mt-3">
              <video ref={videoRef} autoPlay playsInline muted></video>
            </div>
            <div className="button-group mt-3">
              {!recording ? (
                <button className="btn btn-primary" onClick={startRecording}>
                  Bắt đầu quay
                </button>
              ) : (
                <button className="btn btn-danger" onClick={stopRecording}>
                  Dừng quay
                </button>
              )}
            </div>
          </div>
          <div className="col-md-6">
            {videoURL && (
              <div className="video-preview mt-3">
                <h5>Video đã quay:</h5>
                <video
                  src={videoURL}
                  controls
                  className="recorded-video"
                ></video>
                <button onClick={handleUpload} className="btn btn-success mt-2">
                  Huấn luyện khuôn mặt
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceTraining;
