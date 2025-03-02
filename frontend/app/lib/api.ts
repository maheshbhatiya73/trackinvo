const API_BASE_URL = 'http://localhost:8080';

export const api = {
    async login(email: string, password: string) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    },

    async register(username: string, email: string, password: string, role: string) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    role ? { username, email, password, role } : { username, email, password }
                ),
            })
            if (!response.ok) {
                throw new Error('register failed');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    }
};

export const setAuthData = (token: string, userId: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
};

export const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
};

export const getToken = () => localStorage.getItem('token');
export const getUserId = () => localStorage.getItem('userId');