import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { thunkLogin } from "../../redux/session";

import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  // Demo User credentials
  const demoUser = {
    email: "demo@aa.io",
    password: "password",
  };

  const handleDemoLogin = (e) => {
    e.preventDefault();

    // Dispatching the login action for demo user
    dispatch(thunkLogin(demoUser))
      .then(() => {
        closeModal(); // Close modal after successful login
        navigate("/user/:userid"); // Navigate to the user page after login
      })
      .catch((error) => {
        console.error("Login failed", error); // Handle error if login fails
      });
  };

  return (
    <div id="login-form">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Email
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          {errors.email && <p>{errors.email}</p>}
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {errors.password && <p>{errors.password}</p>}
        </div>

        <button type="submit">Log In</button>
      </form>

      {/* Demo User Login Button */}
      <button onClick={handleDemoLogin}>Log in as Demo User</button>
    </div>
  );
}

export default LoginFormModal;
