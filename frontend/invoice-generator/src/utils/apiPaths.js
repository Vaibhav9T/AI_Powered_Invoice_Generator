export const API_BASE_URL =  'https://ai-powered-invoice-generator.onrender.com/api; 

// 'https://ai-powered-invoice-generator.onrender.com/api'  || 'http://localhost:8000/api'

export const API_PATHS = {
 AUTH_API : {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    ME: `${API_BASE_URL}/auth/me`,
},

 INVOICE_API : {
    CREATE: `${API_BASE_URL}/invoices`,
    GET_ALL: `${API_BASE_URL}/invoices`,
    GET_BY_ID: (id) => `${API_BASE_URL}/invoices/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/invoices/${id}`,
    DELETE: (id) => `${API_BASE_URL}/invoices/${id}`,
},

 AI_API : {
    PARSE: `${API_BASE_URL}/ai/parse`,
    PARSE_IMAGE: `${API_BASE_URL}/ai/parse-image`,
    REMINDER: `${API_BASE_URL}/ai/reminder`,
    DASHBOARD: `${API_BASE_URL}/ai/dashboard`,
},

 USER_API : {
    PROFILE: `${API_BASE_URL}/users/profile`,
   UPDATE_PROFILE: `${API_BASE_URL}/users/profile`,
 }
};