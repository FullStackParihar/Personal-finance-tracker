import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// -------------------------
// Axios Instance
// -------------------------
const api = axios.create({
  baseURL: 'https://personal-finance-tracker-t3r5.onrender.com/',
  timeout: 10000,
});

// -------------------------
// Attach token
// -------------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

/// -------------------------
// Register
// -------------------------
export const registerUser = async (data: { username: string; password: string }) => {
  try {
    const response = await api.post('/auth/register', data);
    console.log('Register success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};

// -------------------------
// Login
// -------------------------
export const loginUser = async (data: { username: string; password: string }) => {
  try {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('role');

    const response = await api.post('/auth/login', data);
    console.log('Login response:', response.data);

    const token = response.data?.access_token ||
      response.data?.token ||
      response.data?.accessToken ||
      response.data?.authToken ||
      response.data?.jwt;

    if (token) {
      localStorage.setItem('authToken', token);
      console.log('Token stored:', token);

      const decoded: any = jwtDecode(token);
      const username = decoded?.user || decoded?.username;
      const role = decoded?.role;

      if (username) localStorage.setItem('user', username);
      if (role) localStorage.setItem('role', role);

      return response.data;
    } else {
      console.warn('Login success but no token returned');
      return response.data;
    }
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }

    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    throw error;
  }
};

// -------------------------
// Create Transaction
// -------------------------
export const createTransaction = async (data: {
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  note: string;
}) => {
  try {
    const response = await api.post('/transactions', data);
    console.log('Transaction created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Create transaction error:', error);
    throw error;
  }
};

// -------------------------
// Get Transactions
// -------------------------
export const getTransactions = async () => {
  try {
    const response = await api.get('/transactions');
    console.log('Fetched transactions:', response.data);
    return response.data.reverse(); 
  } catch (error) {
    console.error('Get transactions error:', error);
    throw error;
  }
};

// -------------------------
// Delete Transaction
// -------------------------
export const deleteTransaction = async (id: string) => {
  try {
    const response = await api.delete(`/transactions/${id}`);
    console.log(`Deleted transaction (${id}):`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Delete transaction error (${id}):`, error);
    throw error;
  }
};

// -------------------------
// Update Transaction
// -------------------------
export const updateTransaction = async (id: string, data: {
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  note: string;
}) => {
  try {
    const response = await api.put(`/transactions/${id}`, data);
    console.log(`Updated transaction (${id}):`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Update transaction error (${id}):`, error);
    throw error;
  }
};

// -------------------------
// Totals
// -------------------------

export const getIncomeExpenseTotals = async () => {
  try {
    const transactions = await getTransactions();

    let incomeTotal = 0;
    let expenseTotal = 0;

    transactions.forEach((tx: any) => {
      if (tx.type === 'income') incomeTotal += tx.amount;
      else if (tx.type === 'expense') expenseTotal += tx.amount;
    });

    return {
      income: incomeTotal,
      expense: expenseTotal,
      balance: incomeTotal - expenseTotal,
    };
  } catch (error) {
    console.error('Calculate totals error:', error);
    throw error;
  }
};

// --------------------------
// Auth  
// -------------------------
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('authToken');
};

export const logout = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  localStorage.removeItem('role');
  window.location.href = '/login';
};
