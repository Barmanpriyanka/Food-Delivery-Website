import { useState } from "react";
import "./Login.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Login = ({ url }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${url}/api/admin/login`, { email, password });
      
      if (response.data.success) {
        localStorage.setItem("adminToken", response.data.token);
        toast.success("Login successful!");
        navigate("/orders");
      } else {
        toast.error(response.data.message || "Login failed!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error logging in");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

Login.propTypes = {
  url: PropTypes.string.isRequired,  // ✅ Added validation
};

export default Login;
