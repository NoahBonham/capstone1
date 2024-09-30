import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setToken }) {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                "http://localhost:3000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ usernameOrEmail: identifier, password }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                setToken(data.token);
                localStorage.setItem("token", data.token);
                navigate("/account");
            } else {
                const errorData = await response.json();
                console.error("Error data:", errorData);
                setError(errorData.message || "Login failed.");
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
                {error && <p style={{ color: "red" }}>{error}</p>}
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
                    <button type="submit">Login</button>
                </form>
            </div>
        </>
    );
}