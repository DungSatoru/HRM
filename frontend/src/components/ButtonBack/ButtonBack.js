import { useNavigate } from "react-router-dom";
import "./ButtonBack.css";

const ButtonBack = () => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(-1)} className="btn btn-outline-secondary">
      <i class="fa-solid fa-arrow-left"></i> Quay lại
    </button>
  );
};

export default ButtonBack;
