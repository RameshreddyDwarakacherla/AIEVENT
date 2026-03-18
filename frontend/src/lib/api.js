const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class APIClient {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  getToken() {
    return this.token || localStorage.getItem('authToken');
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };

    // Always get the latest token from localStorage
    const token = localStorage.getItem('authToken') || this.token;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      ...options,
      headers,
    };

    try {
      console.log(`Making ${config.method} request to: ${API_URL}${endpoint}`);
      const response = await fetch(`${API_URL}${endpoint}`, config);
      console.log(`Response status: ${response.status}`);

      // Handle 401 Unauthorized
      if (response.status === 401) {
        // If it's not the /auth/me endpoint, clear token and redirect to login
        if (!endpoint.includes('/auth/me')) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userRole');
          this.token = null;
          
          // Redirect to login if not already there
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
          }
        }
        
        if (endpoint.includes('/auth/me')) {
          return { data: { session: null, user: null }, error: null };
        }
      }

      let data;
      try {
        data = await response.json();
        console.log('Response data:', data);
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        // Handle validation errors from express-validator
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map(err => err.msg || err.message).join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(data.message || data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      if (endpoint.includes('/auth/me')) {
        return { data: { session: null, user: null }, error: null };
      }
      console.error('API Error:', error);
      throw error;
    }
  }

  auth = {
    signUp: async (userData) => {
      try {
        const response = await this.request('/auth/register', {
          method: 'POST',
          body: JSON.stringify(userData),
        });
        
        // Store tokens if registration is successful
        if (response.success && response.data) {
          if (response.data.accessToken) {
            this.setToken(response.data.accessToken);
          }
          if (response.data.refreshToken) {
            localStorage.setItem('refreshToken', response.data.refreshToken);
          }
        }
        
        return response;
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    signInWithPassword: async ({ email, password }) => {
      try {
        const response = await this.request('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });

        if (response.success && response.data) {
          // Backend returns accessToken, not token
          if (response.data.accessToken) {
            this.setToken(response.data.accessToken);
          }
          // Also store refresh token if provided
          if (response.data.refreshToken) {
            localStorage.setItem('refreshToken', response.data.refreshToken);
          }
          return {
            data: { user: response.data.user },
            error: null
          };
        } else {
          return {
            data: null,
            error: { message: response.message || 'Login failed' }
          };
        }
      } catch (error) {
        return {
          data: null,
          error: { message: error.message || 'Login failed' }
        };
      }
    },

    signOut: async () => {
      this.setToken(null);
      localStorage.removeItem('userRole');
      return { error: null };
    },

    getUser: async () => {
      try {
        const token = this.getToken();
        if (!token) return { data: { user: null }, error: null };
        const response = await this.request('/auth/me');
        return { data: { user: response?.data?.user || null }, error: null };
      } catch (error) {
        return { data: { user: null }, error };
      }
    },

    getSession: async () => {
      try {
        const token = this.getToken();
        if (!token) return { data: { session: null }, error: null };
        const response = await this.request('/auth/me');
        if (response?.data?.user) {
          return {
            data: { session: { user: response.data.user } },
            error: null
          };
        }
        return { data: { session: null }, error: null };
      } catch (error) {
        return { data: { session: null }, error: null };
      }
    },

    onAuthStateChange: (callback) => {
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    },

    updateUser: async (updates) => {
      try {
        const response = await this.request('/users/me', {
          method: 'PUT',
          body: JSON.stringify(updates),
        });
        return { data: response.data, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },

    resetPasswordForEmail: async (email) => {
      return { data: null, error: null };
    },
  };

  async get(endpoint) {
    return this.request(endpoint);
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  from(table) {
    const client = this;
    return {
      select: (columns = '*') => {
        const query = {
          table,
          columns,
          filters: [],
          orderBy: null,
          limitVal: null,
        };

        const builder = {
          eq: (column, value) => {
            query.filters.push({ column, operator: 'eq', value });
            return builder;
          },
          order: (column, options = {}) => {
            query.orderBy = { column, ...options };
            return builder;
          },
          in: (column, values) => {
            query.filters.push({ column, operator: 'in', values });
            return builder;
          },
          limit: (n) => {
            query.limitVal = n;
            return builder;
          },
          single: async () => {
            try {
              const params = new URLSearchParams();
              query.filters.forEach(filter => {
                if (filter.operator === 'eq') params.append(filter.column, filter.value);
              });
              const url = `/${table}${params.toString() ? '?' + params.toString() : ''}`;
              const response = await client.request(url);
              return { data: response.data?.[0] || null, error: null };
            } catch (error) {
              return { data: null, error };
            }
          },
          then: async (resolve) => {
            try {
              let url = `/${table}`;
              const params = new URLSearchParams();
              query.filters.forEach(filter => {
                if (filter.operator === 'eq') {
                  params.append(filter.column, filter.value);
                } else if (filter.operator === 'in') {
                  params.append(`${filter.column}_in`, filter.values.join(','));
                }
              });
              if (params.toString()) url += `?${params.toString()}`;
              const response = await client.request(url);
              resolve({ data: response.data || [], error: null });
            } catch (error) {
              resolve({ data: [], error });
            }
          },
        };

        builder.then = async (resolve) => {
          try {
            let url = `/${table}`;
            const params = new URLSearchParams();
            query.filters.forEach(filter => {
              if (filter.operator === 'eq') {
                params.append(filter.column, filter.value);
              } else if (filter.operator === 'in') {
                params.append(`${filter.column}_in`, filter.values.join(','));
              }
            });
            if (params.toString()) url += `?${params.toString()}`;
            const response = await client.request(url);
            resolve({ data: response.data || [], error: null });
          } catch (error) {
            resolve({ data: [], error });
          }
        };

        return builder;
      },

      insert: (data) => {
        const insertBuilder = {
          select: () => { insertBuilder._select = true; return insertBuilder; },
          single: () => { insertBuilder._single = true; return insertBuilder; },
          then: async (resolve) => {
            try {
              const response = await client.request(`/${table}`, {
                method: 'POST',
                body: JSON.stringify(Array.isArray(data) ? data[0] : data),
              });
              if (insertBuilder._single) {
                resolve({ data: response.data || null, error: null });
              } else {
                resolve({ data: response.data || [], error: null });
              }
            } catch (error) {
              resolve({ data: null, error });
            }
          }
        };
        return insertBuilder;
      },

      update: (data) => ({
        eq: async (column, value) => {
          try {
            const response = await client.request(`/${table}/${value}`, {
              method: 'PUT',
              body: JSON.stringify(data),
            });
            return { data: response.data, error: null };
          } catch (error) {
            return { data: null, error };
          }
        },
      }),

      delete: () => ({
        eq: async (column, value) => {
          try {
            await client.request(`/${table}/${value}`, { method: 'DELETE' });
            return { error: null };
          } catch (error) {
            return { error };
          }
        },
      }),

      upsert: async (data) => {
        return client.from(table).insert(data);
      },
    };
  }

  channel(name) {
    return {
      on: () => ({
        on: () => ({ subscribe: () => {} }),
        subscribe: () => {},
      }),
      subscribe: () => {},
      unsubscribe: () => {},
    };
  }
}

export const api = new APIClient();
export const supabase = api;