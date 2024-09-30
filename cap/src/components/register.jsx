import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
    
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    username,
                    email,
                    password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token); 
                navigate("/login");
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Registration failed.");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            setError("An error occurred during registration.");
        }
    };

    return (
        <>
        <h2 className="title">Register</h2>
        <div className="form">
            {error && <p style={{ color: 'red' }}>{error}</p>} {''}
            <form onSubmit={handleRegister}>
                <label>
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <br />
                </label>

                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <br />
                </label>

                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <br />
                </label>

                <label>
                    Password:  
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <br />
                </label>

                <button type="submit">Register</button>
            </form>
        </div>
        </>
    );
}