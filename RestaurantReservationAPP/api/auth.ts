const API_URL = "http://localhost:5242/api/auth"; // dopasuj port

export const loginUser = async (username: string, password: string) => {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, passwordHash: password }),
    });

    if (!res.ok) {
        throw new Error("B³¹d logowania");
    }

    return res.json(); // { id, username, role }
};

export const registerUser = async (username: string, password: string) => {
    const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, passwordHash: password }),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "B³¹d rejestracji");
    }

    return res.text(); // success
};
