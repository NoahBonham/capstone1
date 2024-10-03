import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ usernameOrEmail: identifier, password }),
            });

            if (response.ok) {
                const result = await response.json();
                login(result.token);
                localStorage.setItem("token", result.token);
                navigate("/account");
            } else {
                const errorData = await response.json();
                console.error("Error data:", errorData);
                setError(errorData.message || "Please check your login and password.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            setError("An unexpected error occurred. Please try again.");
        }
    };

    return (
        <>
            <h2 className="title">Login</h2>
            <div className="form">
                {error && <p>{error}</p>}
                <form onSubmit={handleLogin}>
                    <label>
                        Email or Username:
                        <br />
                        <input
                            type="text"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                        />
                        <br />
                    </label>
                    <label>
                        Password:
                        <br />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <br />
                    <button type="submit"
                    className="formbutton">Login</button>
                </form>
            </div>
        </>
    );
}