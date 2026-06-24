import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    gender: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await register(form);

      // reset forme nakon uspeha
      setForm({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        gender: "",
        password: "",
        confirm_password: "",
      });

      setErrors({});
      navigate("/login");
    } catch (err) {
      setErrors(err.response?.data?.errors || {
        general: "Something went wrong",
      });
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>

        {errors.general && (
          <p style={{ color: "red" }}>{errors.general}</p>
        )}

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="first_name"
          placeholder="First name"
          value={form.first_name}
          onChange={handleChange}
          required
        />

        <input
          name="last_name"
          placeholder="Last name"
          value={form.last_name}
          onChange={handleChange}
          required
        />

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <input
          name="confirm_password"
          type="password"
          placeholder="Confirm password"
          value={form.confirm_password}
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>

        {/* backend validation errors */}
        {Object.values(errors).map((err, i) => (
          <p key={i} style={{ color: "red", margin: "5px 0" }}>
            {err}
          </p>
        ))}
      </form>
    </div>
  );
}