import axios from "axios";

const BASE_URL = "https://jewelleryapp-1.onrender.com/";

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error?.response?.data?.message || "Something went wrong");
    }
);

// Authentication APIs
export const loginUser = async (email, password) => {
    try {
        const response = await apiClient.post("super-admin/auth/login", { email, password });
        if (response.status === 200 && response.data.status) {
            const { _token, name, email, roles } = response.data.data;
            const token = _token;
            localStorage.setItem("userName", name);
            localStorage.setItem("token", token);
            localStorage.setItem("userEmail", email);
            localStorage.setItem("userRoles", JSON.stringify(roles));
            return { status: true, message: response.data.message };
        } else {
            return { status: false, message: response.data.message || "Login failed" };
        }
    } catch (error) {
        return {
            status: false,
            message: error?.response?.data?.message || "Something went wrong",
        };
    }
};

export const registerUser = async (userData) => {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data;
};

export const resetPassword = async (otp, newPassword) => {
    const response = await apiClient.post("/auth/reset-password", { otp, password: newPassword });
    return response.data;
};

// Gold Product APIs
export const addGoldProduct = async (formData) => {
    const response = await apiClient.post('/gold/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const getAllGoldProducts = async () => {
    const response = await apiClient.get('/gold');
    return response.data;
};

export const searchGoldProducts = async (params) => {
    const response = await apiClient.get('/gold/search', { params });
    return response.data;
};

export const getGoldProductById = async (id) => {
    const response = await apiClient.get(`/gold/${id}`);
    return response.data;
};

export const updateGoldProduct = async (id, formData) => {
    const response = await apiClient.put(`/gold/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const deleteGoldProduct = async (id) => {
    const response = await apiClient.delete(`/gold/${id}`);
    return response.data;
};

// Home Page APIs
export const createHomePage = async (data) => {
    const response = await apiClient.post('/home/create', data);
    return response.data;
};

// Order APIs
export const getAllOrders = async () => {
    const response = await apiClient.get('/order');
    return response.data;
};

export const getOrderById = async (id) => {
    const response = await apiClient.get(`/order/${id}`);
    return response.data;
};

export const updateOrder = async (id, data) => {
    const response = await apiClient.put(`/order/${id}`, data);
    return response.data;
};

export const deleteOrder = async (id) => {
    const response = await apiClient.delete(`/order/${id}`);
    return response.data;
};

// Blog APIs
export const createBlog = async (formData) => {
    const response = await apiClient.post('/blog/blogs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const updateBlog = async (id, formData) => {
    const response = await apiClient.put(`/blog/blogs/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const deleteBlog = async (id) => {
    const response = await apiClient.delete(`/blog/blogs/${id}`);
    return response.data;
};

// Category APIs
export const createCategory = async (formData) => {
    const response = await apiClient.post('/category/createCategory', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

// About APIs
export const createAbout = async (data) => {
    const response = await apiClient.post('/about/create', data);
    return response.data;
};

// Utility API: Fetch Privacy Policy
export const fetchPrivacyPolicy = async () => {
    const response = await apiClient.get("super-admin/utility/privacy");
    return response.data;
};

export { apiClient };
