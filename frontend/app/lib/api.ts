const API_BASE_URL = 'http://localhost:8080';

interface Unit {
    id: string;
    name: string;
    abbreviation: string;
    created_at: string;
    updated_at?: string;
    deleted?: boolean;
}

interface Product {
    id: string;
    name: string;
    category_id: string;
    unit_id: string;
    price: number;
    created_at: string;
    updated_at?: string;
    deleted?: boolean;
}

interface Customer {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    created_at: string;
    updated_at?: string;
    deleted?: boolean;
}

interface InvoiceData {
    customer_id: string;
    issue_date: string;
    due_date: string;
    reference_number: string;
    recurring: boolean;
    cycle?: string;
    products: Product[];
    discount_type: string;
    discount_amount: number;
    invoice_template_id: string;
    note: string;
    total_amount: number;
}

export const api = {

    async login(email: string, password: string, showToast?: (type: "success" | "error" | "info" | "warning", message: string) => void) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                if (showToast) showToast("success", "Login successful!");
                return data;
            }
        } catch (error) {
            if (showToast) showToast("error", "Login failed. Please check your credentials.");
            throw error;
        }
    },

    async register(
        username: string,
        email: string,
        password: string,
        role: string,
        showToast?: (type: "success" | "error" | "info" | "warning", message: string) => void
    ) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(role ? { username, email, password, role } : { username, email, password }),
            });

            if (!response.ok) {
                if (showToast) showToast("error", "Registration failed. Please try again.");
                throw new Error('Registration failed');
            }

            const data = await response.json();
            if (showToast) showToast("success", "Registration successful!");
            return data;
        } catch (error) {
            if (showToast) showToast("error", "An error occurred during registration.");
            throw error;
        }
    },

    async CreateManager(
        name: string,
        email: string,
        password: string,
        role: string,
        status: string,
        avatar?: any,  // Supports file or URL
        showToast?: (type: "success" | "error" | "info" | "warning", message: string) => void
    ) {
        try {
            const token = getToken();
            if (!token) {
                showToast?.("error", "Unauthorized: No token found.");
                throw new Error("Unauthorized: No token found.");
            }

            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("role", role);
            formData.append("status", status);

            if (avatar instanceof File) {
                formData.append("avatar", avatar);
            } else {
                formData.append("avatar", avatar || "https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png");
            }

            formData.append("lastLogin", "");

            const response = await fetch(`${API_BASE_URL}/api/superadmin/managers/`, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                },
                body: formData, // Send as FormData (No `Content-Type`, browser sets it)
            });

            if (!response.ok) {
                showToast?.("error", "Failed to create manager. Please try again.");
                throw new Error("Failed to create manager.");
            }

            const data = await response.json();
            showToast?.("success", "Manager created successfully!");
            return data;
        } catch (error) {
            showToast?.("error", "An error occurred while creating the manager.");
            console.error("CreateManager Error:", error);
            throw error;
        }
    },

    async EditManager(
        id: string,
        name: string,
        email: string,
        password?: string,
        role?: string,
        status?: string,
        lastLogin?: string | null,
        avatar?: any,
        showToast?: (type: "success" | "error" | "info" | "warning", message: string) => void
    ) {
        try {
            const token = getToken();
            if (!token) {
                showToast?.("error", "Unauthorized: No token found.");
                throw new Error("Unauthorized: No token found.");
            }

            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("role", role || "");
            formData.append("status", status || "");
            formData.append("lastLogin", lastLogin || "");

            if (avatar instanceof File) {
                formData.append("avatar", avatar);
            } else if (avatar) {
                formData.append("avatar", avatar);
            }

            if (password) {
                formData.append("password", password);
            }

            const response = await fetch(`${API_BASE_URL}/api/superadmin/managers/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `${token}`,
                },
                body: formData, // Send as FormData
            });

            if (!response.ok) {
                showToast?.("error", "Failed to update manager. Please try again.");
                throw new Error("Failed to update manager.");
            }

            const data = await response.json();
            showToast?.("success", "Manager updated successfully!");
            return data;
        } catch (error) {
            console.error("EditManager error:", error);
            showToast?.("error", "An error occurred while updating the manager.");
            throw error;
        }
    },

    async DeleteManager(
        id: string,
        showToast?: (type: "success" | "error" | "info" | "warning", message: string) => void
    ) {
        try {
            const token = getToken();
            if (!token) {
                if (showToast) showToast("error", "Unauthorized: No token found.");
                throw new Error("Unauthorized: No token found.");
            }

            const response = await fetch(`${API_BASE_URL}/api/superadmin/managers/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
            });

            if (!response.ok) {
                if (showToast) showToast("error", "Failed to delete manager. Please try again.");
                throw new Error("Failed to delete manager.");
            }

            if (showToast) showToast("success", "Manager deleted successfully!");
            return await response.json();
        } catch (error) {
            console.error("DeleteManager error:", error);
            if (showToast) showToast("error", "An error occurred while deleting the manager.");
            throw error;
        }
    },

    async getManagers(
        showToast?: (type: "success" | "error" | "info" | "warning", message: string) => void
    ) {
        try {
            const token = getToken();
            if (!token) {
                console.warn("Unauthorized: No token found.");
                if (showToast) showToast("error", "Unauthorized: No token found.");
                return null; // Return null if no token is available
            }

            const response = await fetch(`${API_BASE_URL}/api/superadmin/managers/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
            });

            if (!response.ok) {
                console.error("Failed to fetch managers, status:", response.status);
                if (showToast) showToast("error", "Failed to retrieve managers. Please try again.");
                return []; // Return an empty array instead of throwing an error
            }

            const data = await response.json();
            if (showToast) showToast("success", "Managers retrieved successfully!");
            return data;
        } catch (error) {
            console.error("Error fetching managers:", error);
            if (showToast) showToast("error", "An error occurred while fetching managers.");
            return []; // Return an empty array to avoid breaking the application
        }
    },

    async GetManagerById(
        id: any,
        showToast?: (type: "success" | "error" | "info" | "warning", message: string) => void
    ) {
        try {
            const token = getToken();
            if (!token) {
                console.warn("Unauthorized: No token found.");
                if (showToast) showToast("error", "Unauthorized: No token found.");
                return null; // Return null if no token is available
            }

            const response = await fetch(`${API_BASE_URL}/api/superadmin/managers/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
            });

            if (!response.ok) {
                console.error(`Failed to fetch manager (ID: ${id}), status:`, response.status);
                if (showToast) showToast("error", "Failed to retrieve manager details. Please try again.");
                return null; // Return null instead of throwing an error
            }

            const data = await response.json();
            if (showToast) showToast("success", "Manager details retrieved successfully!");
            return data;
        } catch (error) {
            console.error("Error fetching manager by ID:", error);
            if (showToast) showToast("error", "An error occurred while fetching manager details.");
            return null; // Return null to avoid breaking the app
        }
    },
    async getUsers(
        showToast?: (type: "success" | "error" | "info" | "warning", message: string) => void
    ) {
        try {
            const token = getToken();
            if (!token) {
                console.warn("Unauthorized: No token found.");
                if (showToast) showToast("error", "Unauthorized: No token found.");
                return null; // Return null if no token is available
            }

            const response = await fetch(`${API_BASE_URL}/api/superadmin/users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
            });

            if (!response.ok) {
                console.error("Failed to fetch users, status:", response.status);
                if (showToast) showToast("error", "Failed to retrieve users. Please try again.");
                return []; // Return an empty array instead of throwing an error
            }

            const data = await response.json();
            if (showToast) showToast("success", "Users retrieved successfully!");
            return data;
        } catch (error) {
            console.error("Error fetching users:", error);
            if (showToast) showToast("error", "An error occurred while fetching users.");
            return []; // Return an empty array to avoid breaking the application
        }
    },

    async getUsersById(
        id?: any,
        showToast?: (type: "success" | "error" | "info" | "warning", message: string) => void
    ) {
        try {
            const token = getToken();
            const id = getUserId()
            if (!token) {
                console.warn("Unauthorized: No token found.");
                if (showToast) showToast("error", "Unauthorized: No token found.");
                return null; // Return null if no token is available
            }

            const response = await fetch(`${API_BASE_URL}/api/superadmin/users/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
            });

            if (!response.ok) {
                console.error(`Failed to fetch user (ID: ${id}), status:`, response.status);
                if (showToast) showToast("error", "Failed to retrieve user details. Please try again.");
                return null; // Return null instead of throwing an error
            }

            const data = await response.json();
            if (showToast) showToast("success", "User details retrieved successfully!");
            return data;
        } catch (error) {
            console.error("Error fetching user by ID:", error);
            if (showToast) showToast("error", "An error occurred while fetching user details.");
            return null; // Return null to avoid breaking the app
        }
    },
    async createUser(
        username: string,
        email: string,
        password: string,
        role?: string,
        status?: string,
        lastLogin?: string | null,
        avatar?: any,
        showToast?: (type: "success" | "error" | "info" | "warning", message: string) => void
    ) {
        try {
            const token = getToken();
            if (!token) {
                console.warn("Unauthorized: No token found.");
                if (showToast) showToast("error", "Unauthorized: No token found.");
                return null;
            }

            const formData = new FormData();
            formData.append("username", username);
            formData.append("email", email);
            if (role) formData.append("role", role);
            if (status) formData.append("status", status);
            if (lastLogin) formData.append("lastLogin", lastLogin);
            if (password) formData.append("password", password);
            if (avatar instanceof File) {
                formData.append("avatar", avatar);
            } else if (avatar) {
                formData.append("avatar", avatar);
            }

            // Debug FormData
            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            const response = await fetch(`${API_BASE_URL}/api/superadmin/users`, {
                method: 'POST',
                headers: {
                    'Authorization': `${token}`, // Do not set 'Content-Type' manually
                },
                body: formData,
            });

            if (!response.ok) {
                console.error("Failed to create user, status:", response.status);
                if (showToast) showToast("error", "Failed to create user. Please try again.");
                return null;
            }

            const data = await response.json();
            if (showToast) showToast("success", "User created successfully!");
            return data;
        } catch (error) {
            console.error("Error creating user:", error);
            if (showToast) showToast("error", "An error occurred while creating the user.");
            return null;
        }
    },
    async EditUser(
        id: string,
        username: string,
        email: string,
        role?: any,
        status?: any,
        lastLogin?: string | null,
        avatar?: any,
        showToast?: (type: "success" | "error" | "info" | "warning", message: string) => void
    ) {
        try {
            const token = getToken();
            if (!token) {
                console.warn("Unauthorized: No token found.");
                if (showToast) showToast("error", "Unauthorized: No token found.");
                return null;
            }

            const requestBody: Record<string, any> = { username, email };

            const formData = new FormData();
            formData.append("name", username);
            formData.append("email", email);
            formData.append("role", role || "");
            formData.append("status", status || "");
            formData.append("lastLogin", lastLogin || "");

            if (avatar instanceof File) {
                formData.append("avatar", avatar);
            } else if (avatar) {
                formData.append("avatar", avatar);
            }

            const response = await fetch(`${API_BASE_URL}/api/superadmin/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                console.error(`Failed to update user (ID: ${id}), status:`, response.status);
                if (showToast) showToast("error", "Failed to update user. Please try again.");
                return null;
            }

            const data = await response.json();
            if (showToast) showToast("success", "User updated successfully!");
            return data;
        } catch (error) {
            console.error("Error updating user:", error);
            if (showToast) showToast("error", "An error occurred while updating the user.");
            return null;
        }
    },
    async DeleteUser(
        id: string,
        showToast?: (type: "success" | "error" | "info" | "warning", message: string) => void
    ) {
        try {
            const token = getToken();
            if (!token) {
                console.warn("Unauthorized: No token found.");
                if (showToast) showToast("error", "Unauthorized: No token found.");
                return null;
            }

            const response = await fetch(`${API_BASE_URL}/api/superadmin/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
            });

            if (!response.ok) {
                console.error(`Failed to delete user (ID: ${id}), status:`, response.status);
                if (showToast) showToast("error", "Failed to delete user. Please try again.");
                return null;
            }

            if (showToast) showToast("success", "User deleted successfully!");
            return true;
        } catch (error) {
            console.error("Error deleting user:", error);
            if (showToast) showToast("error", "An error occurred while deleting the user.");
            return null;
        }
    },
    async CreateCategories(
        name: string,
        description: string,
        showToast?: (type: "success" | "error" | "info" | "warning", message: string) => void
    ) {
        try {
            const token = getToken();
            if (!token) {
                console.warn("Unauthorized: No token found.");
                if (showToast) showToast("error", "Unauthorized: No token found.");
                return null;
            }

            const response = await fetch(`${API_BASE_URL}/api/categories`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
                body: JSON.stringify({ name, description }),
            });

            if (!response.ok) {
                console.error(`Failed to create category, status: ${response.status}`);
                if (showToast) showToast("error", "Failed to create category. Please try again.");
                return null;
            }

            const data = await response.json();
            if (showToast) showToast("success", "Category created successfully!");
            return data;
        } catch (error) {
            console.error("Error creating category:", error);
            if (showToast) showToast("error", "An error occurred while creating the category.");
            return null;
        }
    },
    async EditCategories(
        id: string,
        name: string,
        description: string,
        showToast?: (type: "success" | "error" | "info" | "warning", message: string) => void
    ) {
        try {
            const token = getToken();
            if (!token) {
                console.warn("Unauthorized: No token found.");
                if (showToast) showToast("error", "Unauthorized: No token found.");
                return null;
            }

            const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
                body: JSON.stringify({ name, description }),
            });

            if (!response.ok) {
                console.error(`Failed to update category, status: ${response.status}`);
                if (showToast) showToast("error", "Failed to update category. Please try again.");
                return null;
            }

            const data = await response.json();
            if (showToast) showToast("success", "Category updated successfully!");
            return data;
        } catch (error) {
            console.error("Error updating category:", error);
            if (showToast) showToast("error", "An error occurred while updating the category.");
            return null;
        }
    },
    async GetCategories(showToast?: (type: "success" | "error" | "info" | "warning", message: string) => void) {
        try {
            const token = getToken();
            if (!token) {
                console.warn("Unauthorized: No token found.");
                if (showToast) showToast("error", "Unauthorized: No token found.");
                return null;
            }

            const response = await fetch(`${API_BASE_URL}/api/categories`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            });

            if (!response.ok) {
                console.error(`Failed to fetch categories, status: ${response.status}`);
                if (showToast) showToast("error", "Failed to fetch categories.");
                return null;
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching categories:", error);
            if (showToast) showToast("error", "An error occurred while fetching categories.");
            return null;
        }
    },

    async GetCategoryById(id: string, showToast?: (type: "success" | "error" | "info" | "warning", message: string) => void) {
        try {
            const token = getToken();
            if (!token) {
                console.warn("Unauthorized: No token found.");
                if (showToast) showToast("error", "Unauthorized: No token found.");
                return null;
            }

            const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            });

            if (!response.ok) {
                console.error(`Failed to fetch category, status: ${response.status}`);
                if (showToast) showToast("error", "Failed to fetch category.");
                return null;
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching category:", error);
            if (showToast) showToast("error", "An error occurred while fetching the category.");
            return null;
        }
    },
    async DeleteCategoryById(id: string, showToast?: (type: "success" | "error" | "info" | "warning", message: string) => void) {
        try {
            const token = getToken();
            if (!token) {
                console.warn("Unauthorized: No token found.");
                if (showToast) showToast("error", "Unauthorized: No token found.");
                return null;
            }

            const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            });

            if (!response.ok) {
                console.error(`Failed to delete category, status: ${response.status}`);
                if (showToast) showToast("error", "Failed to delete category.");
                return null;
            }

            if (showToast) showToast("success", "Category deleted successfully.");
            return { success: true };
        } catch (error) {
            console.error("Error deleting category:", error);
            if (showToast) showToast("error", "An error occurred while deleting the category.");
            return null;
        }
    },
    async createUnit(
        name: string,
        abbreviation: string,
        showToast?: (type: "success" | "error", message: string) => void
    ) {
        try {
            const token = getToken();
            if (!token) {
                console.warn("No authentication token found.");
                if (showToast) showToast("error", "Unauthorized: No authentication token found.");
                return null;
            }

            const response = await fetch(`${API_BASE_URL}/api/units`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, abbreviation }),
            });

            if (!response.ok) {
                const errorMessage = `Failed to create unit: ${response.statusText}`;
                console.error(errorMessage);
                if (showToast) showToast("error", errorMessage);
                return null;
            }

            const data = await response.json();
            if (showToast) showToast("success", "Unit created successfully.");
            return data;
        } catch (error) {
            console.error("Error creating unit:", error);
            if (showToast) showToast("error", "An error occurred while creating the unit.");
            return null;
        }
    },

    // Update a unit by ID
    async updateUnit(
        id: string,
        unitData: { name?: string; abbreviation?: string },
        showToast?: (type: "success" | "error", message: string) => void
    ) {
        try {
            const token = getToken();
            if (!token) {
                console.warn("No authentication token found.");
                if (showToast) showToast("error", "Unauthorized: No authentication token found.");
                return null;
            }

            const response = await fetch(`${API_BASE_URL}/api/units/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(unitData),
            });

            if (!response.ok) {
                const errorMessage = `Failed to update unit: ${response.statusText}`;
                console.error(errorMessage);
                if (showToast) showToast("error", errorMessage);
                return null;
            }

            const data = await response.json();
            if (showToast) showToast("success", "Unit updated successfully.");
            return data;
        } catch (error) {
            console.error("Error updating unit:", error);
            if (showToast) showToast("error", "An error occurred while updating the unit.");
            return null;
        }
    },

    // Delete a unit by ID
    async deleteUnitById(
        id: string,
        showToast?: (type: "success" | "error", message: string) => void
    ) {
        try {
            const token = getToken();
            if (!token) {
                console.warn("No authentication token found.");
                if (showToast) showToast("error", "Unauthorized: No authentication token found.");
                return null;
            }

            const response = await fetch(`${API_BASE_URL}/api/units/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorMessage = `Failed to delete unit: ${response.statusText}`;
                console.error(errorMessage);
                if (showToast) showToast("error", errorMessage);
                return null;
            }

            if (showToast) showToast("success", "Unit deleted successfully.");
            return { success: true };
        } catch (error) {
            console.error("Error deleting unit:", error);
            if (showToast) showToast("error", "An error occurred while deleting the unit.");
            return null;
        }
    },

    // Get all units
    async getUnits(showToast?: (type: "success" | "error", message: string) => void): Promise<Unit[] | null> {
        try {
            const token = getToken();
            if (!token) {
                console.warn("No authentication token found.");
                if (showToast) showToast("error", "Unauthorized: No authentication token found.");
                return null;
            }

            const response = await fetch(`${API_BASE_URL}/api/units`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorMessage = `Failed to fetch units: ${response.statusText}`;
                console.error(errorMessage);
                if (showToast) showToast("error", errorMessage);
                return null;
            }

            const data = await response.json();
            if (showToast) showToast("success", "Units fetched successfully.");
            return data;
        } catch (error) {
            console.error("Error fetching units:", error);
            if (showToast) showToast("error", "An error occurred while fetching units.");
            return null;
        }
    },
    // Get a unit by ID
    async getUnitById(id: string, showToast?: (type: "success" | "error", message: string) => void): Promise<Unit | null> {
        try {
            const token = getToken();
            if (!token) {
                console.warn("No authentication token found.");
                if (showToast) showToast("error", "Unauthorized: No authentication token found.");
                return null;
            }

            const response = await fetch(`${API_BASE_URL}/api/units/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorMessage = `Failed to fetch unit: ${response.statusText}`;
                console.error(errorMessage);
                if (showToast) showToast("error", errorMessage);
                return null;
            }

            const data = await response.json();
            if (showToast) showToast("success", "Unit fetched successfully.");
            return data;
        } catch (error) {
            console.error("Error fetching unit:", error);
            if (showToast) showToast("error", "An error occurred while fetching the unit.");
            return null;
        }
    },

    // --- Product Functions ---

    // Create a product
    async createProduct(
        productData: { name: string; category_id: string; unit_id: string; price: number },
        showToast?: (type: "success" | "error", message: string) => void
    ): Promise<Product | null> {
        try {
            const token = getToken();
            if (!token) {
                console.warn("No authentication token found.");
                if (showToast) showToast("error", "Unauthorized: No authentication token found.");
                return null;
            }

            const response = await fetch(`${API_BASE_URL}/api/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                const errorMessage = `Failed to create product: ${response.statusText}`;
                console.error(errorMessage);
                if (showToast) showToast("error", errorMessage);
                return null;
            }

            const data = await response.json();
            if (showToast) showToast("success", "Product created successfully.");
            return data;
        } catch (error) {
            console.error("Error creating product:", error);
            if (showToast) showToast("error", "An error occurred while creating the product.");
            return null;
        }
    },
    // Update a product by ID
    async updateProduct(
        id: string,
        productData: { name?: string; category_id?: string; unit_id?: string; price?: number },
        showToast?: (type: "success" | "error", message: string) => void
    ): Promise<Product | null> {
        try {
            const token = getToken();
            if (!token) {
                console.warn("No authentication token found.");
                if (showToast) showToast("error", "Unauthorized: No authentication token found.");
                return null;
            }

            const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                const errorMessage = `Failed to update product: ${response.statusText}`;
                console.error(errorMessage);
                if (showToast) showToast("error", errorMessage);
                return null;
            }

            const data = await response.json();
            if (showToast) showToast("success", "Product updated successfully.");
            return data;
        } catch (error) {
            console.error("Error updating product:", error);
            if (showToast) showToast("error", "An error occurred while updating the product.");
            return null;
        }
    },

    // Delete a product by ID
    async deleteProductById(id: string, showToast?: (type: "success" | "error", message: string) => void): Promise<void> {
        try {
            const token = getToken();
            if (!token) {
                console.warn("No authentication token found.");
                if (showToast) showToast("error", "Unauthorized: No authentication token found.");
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorMessage = `Failed to delete product: ${response.statusText}`;
                console.error(errorMessage);
                if (showToast) showToast("error", errorMessage);
                return;
            }

            if (response.status === 204) {
                if (showToast) showToast("success", "Product deleted successfully.");
                return;
            }

            const data = await response.json();
            if (showToast) showToast("success", "Product deleted successfully.");
            return data;
        } catch (error) {
            console.error("Error deleting product:", error);
            if (showToast) showToast("error", "An error occurred while deleting the product.");
        }
    },

    // Fetch all products
    async getProducts(showToast?: (type: "success" | "error", message: string) => void): Promise<Product[] | null> {
        try {
            const token = getToken();
            if (!token) {
                console.warn("No authentication token found.");
                if (showToast) showToast("error", "Unauthorized: No authentication token found.");
                return null;
            }

            const response = await fetch(`${API_BASE_URL}/api/products`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorMessage = `Failed to fetch products: ${response.statusText}`;
                console.error(errorMessage);
                if (showToast) showToast("error", errorMessage);
                return null;
            }

            const data = await response.json();
            if (showToast) showToast("success", "Products fetched successfully.");
            return data;
        } catch (error) {
            console.error("Error fetching products:", error);
            if (showToast) showToast("error", "An error occurred while fetching products.");
            return null;
        }
    },

    // Get a single product by ID
    async getProductById(id: string, showToast?: (type: "success" | "error", message: string) => void): Promise<Product | null> {
        try {
            const token = getToken();
            if (!token) {
                console.warn("No authentication token found.");
                if (showToast) showToast("error", "Unauthorized: No authentication token found.");
                return null;
            }

            const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorMessage = `Failed to fetch product: ${response.statusText}`;
                console.error(errorMessage);
                if (showToast) showToast("error", errorMessage);
                return null;
            }

            const data = await response.json();
            if (showToast) showToast("success", "Product fetched successfully.");
            return data;
        } catch (error) {
            console.error("Error fetching product:", error);
            if (showToast) showToast("error", "An error occurred while fetching the product.");
            return null;
        }
    },
    async createCustomer(customerData: { name: string; email: string; phone?: string; address?: string },
        showToast?: (type: 'success' | 'error', message: string) => void) {
        try {
            const token = getToken();
            if (!token) throw new Error('No authentication token found');

            const response = await fetch(`${API_BASE_URL}/api/customers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(customerData),
            });

            if (!response.ok) {
                const errorMessage = `Failed to create customer: ${response.statusText}`;
                if (showToast) showToast('error', errorMessage);
            }

            const data = await response.json();
            if (showToast) showToast('success', 'Customer created successfully');
            return data;
        } catch (error: any) {
            console.error('Error creating customer:', error);
            if (showToast) showToast('error', error.message || 'An error occurred while creating customer');
        }
    },
    async updateCustomer(
        id: string,
        customerData: { name?: string; email?: string; phone?: string; address?: string },
        showToast?: (type: 'success' | 'error', message: string) => void
    ): Promise<Customer> {
        try {
            const token = getToken();
            if (!token) throw new Error('No authentication token found');

            const response = await fetch(`${API_BASE_URL}/api/customers/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(customerData),
            });

            if (!response.ok) {
                const errorMessage = `Failed to update customer: ${response.statusText}`;
                if (showToast) showToast('error', errorMessage);
            }

            const data = await response.json();
            if (showToast) showToast('success', 'Customer updated successfully');
            return data;
        } catch (error: any) {
            if (showToast) showToast('error', error.message || 'An error occurred while updating customer');
            throw error;
        }
    },
    async deleteCustomerById(id: string, showToast?: (type: 'success' | 'error', message: string) => void
    ): Promise<void> {
        try {
            const token = getToken();
            if (!token) throw new Error('No authentication token found');

            const response = await fetch(`${API_BASE_URL}/api/customers/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorMessage = `Failed to delete customer: ${response.statusText}`;
                if (showToast) showToast('error', errorMessage);
            }

            if (response.status === 204) return; // No content
            const data = await response.json(); // Rare case
            if (showToast) showToast('success', 'Customer deleted successfully');
            return data;
        } catch (error: any) {
            console.error('Error deleting customer:', error);
            if (showToast) showToast('error', error.message || 'An error occurred while deleting customer');
            throw error;
        }
    },

    // Get all customers
    async getCustomers(): Promise<Customer[]> {
        try {
            const token = getToken();
            if (!token) throw new Error('No authentication token found');

            const response = await fetch(`${API_BASE_URL}/api/customers`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                console.error(`Failed to fetch customers: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching customers:', error);
            throw error;
        }
    },

    // Get a customer by ID
    async getCustomerById(id: string, showToast?: (type: 'success' | 'error', message: string) => void): Promise<Customer> {
        try {
            const token = getToken();
            if (!token) throw new Error('No authentication token found');

            const response = await fetch(`${API_BASE_URL}/api/customers/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorMessage = `Failed to fetch customer: ${response.statusText}`;
                if (showToast) showToast('error', errorMessage);
            }

            const data = await response.json();
            if (showToast) showToast('success', 'Customer fetched successfully');
            return data;
        } catch (error: any) {
            if (showToast) showToast('error', error.message || 'An error occurred while fetching customer');
            console.error('Error fetching customer:', error);
            throw error;
        }
    },
    async GetInvoices() {
        try {
            const token = getToken();
            if (!token) throw new Error('No authentication token found');

            const response = await fetch(`${API_BASE_URL}/api/invoices/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const errorMessage = `Failed to fetch customer: ${response.statusText}`;
                console.error(errorMessage)
            }
            const data = await response.json();
            return data
        } catch (error) {
            console.error(error)
        }
    },
    async createInvoice(invoiceData: any, showToast?: (type: 'success' | 'error', message: string) => void) {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/api/invoices/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(invoiceData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(errorData.message || `Failed to create invoice: ${response.statusText}`);
        }

        return response.json();
    },

    async updateInvoice(id: string, invoiceData: Partial<InvoiceData>, showToast?: (type: 'success' | 'error', message: string) => void) {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/api/invoices/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(invoiceData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(errorData.message || `Failed to update invoice: ${response.statusText}`);
        }

        return response.json();
    },

    async deleteInvoice(id: string, showToast?: (type: 'success' | 'error', message: string) => void) {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/api/invoices/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(errorData.message || `Failed to delete invoice: ${response.statusText}`);
        }


        return null;
    },

    async getAllInvoices() {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/api/invoices/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(errorData.message || `Failed to fetch invoices: ${response.statusText}`);
        }

        return response.json();
    },

    async getInvoiceById(id: string) {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/api/invoices/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(errorData.message || `Failed to fetch invoice: ${response.statusText}`);
        }

        return response.json();
    },
    async GetQuotations() {
        try {
            const token = getToken();

            const response = await fetch(`${API_BASE_URL}/api/quotation`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                console.error("somthing want to wrong")
            }

            const data = await response.json();

            return data
        } catch (error) {
            console.error(error)
        }
    },
    async getQuotationById(id: any) {
        try {
            const token = getToken();
            const response = await fetch(`${API_BASE_URL}/api/quotation/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Failed to fetch quotation");

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    },
    async createQuotation(
        quotationData: any,
        showToast?: (type: 'success' | 'error', message: string) => void
    ): Promise<any> {
        try {
            const token = getToken();
            if (!token) throw new Error('No authentication token found');

            const response = await fetch(`${API_BASE_URL}/api/quotation`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(quotationData),
            });

            if (!response.ok) throw new Error('Failed to create quotation');

            const data = await response.json();
            if (showToast) showToast('success', 'Quotation created successfully');
            return data;
        } catch (error: any) {
            console.error('Error creating quotation:', error);
            if (showToast) showToast('error', error.message || 'An error occurred while creating quotation');
            throw error;
        }
    },
    async updateQuotation(
        id: string,
        updatedData: any,
        showToast?: (type: 'success' | 'error', message: string) => void
    ): Promise<any> {
        try {
            const token = getToken();
            if (!token) throw new Error('No authentication token found');

            const response = await fetch(`${API_BASE_URL}/api/quotation/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) throw new Error('Failed to update quotation');

            const data = await response.json();
            if (showToast) showToast('success', 'Quotation updated successfully');
            return data;
        } catch (error: any) {
            console.error('Error updating quotation:', error);
            if (showToast) showToast('error', error.message || 'An error occurred while updating quotation');
            throw error;
        }
    },
    async deleteQuotation(
        id: string,
        showToast?: (type: 'success' | 'error', message: string) => void
    ): Promise<void> {
        try {
            const token = getToken();
            if (!token) throw new Error('No authentication token found');

            const response = await fetch(`${API_BASE_URL}/api/quotation/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorMessage = `Failed to delete quotation: ${response.statusText}`;
                if (showToast) showToast('error', errorMessage);
                throw new Error(errorMessage);
            }

            if (response.status === 204) return; // No content
            const data = await response.json(); // Rare case
            if (showToast) showToast('success', 'Quotation deleted successfully');
            return data;
        } catch (error: any) {
            console.error('Error deleting quotation:', error);
            if (showToast) showToast('error', error.message || 'An error occurred while deleting quotation');
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