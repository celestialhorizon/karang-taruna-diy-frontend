const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

// Custom error class to handle API errors with response data
class ApiError extends Error {
  public response: any;
  public status: number;
  
  constructor(message: string, response: any, status: number) {
    super(message);
    this.name = 'ApiError';
    this.response = response;
    this.status = status;
  }
}

export const api = {
  async register(userData: {
    name: string;
    username: string;
    email: string;
    password: string;
    karangTarunaName: string;
    provinsi: string;
    kabupatenKota: string;
    kecamatan: string;
    jalan: string;
    phone?: string;
    interests?: string[];
    skillLevel?: string;
    peranAnggota?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new ApiError(data.message || 'Registration failed', data, response.status);
    }
    return data;
  },

  async login(credentials: { email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new ApiError(data.message || 'Login failed', data, response.status);
    }
    return data;
  },

  async getCurrentUser(token: string) {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new ApiError(data.message || 'Failed to get user', data, response.status);
    }
    return data;
  },

  async getUsers(token: string) {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new ApiError(data.message || 'Failed to get users', data, response.status);
    }
    return data;
  },

  async updateUser(token: string, userId: string, userData: any) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new ApiError(data.message || 'Failed to update user', data, response.status);
    }
    return data;
  },

  async deleteUser(token: string, userId: string) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new ApiError(data.message || 'Failed to delete user', data, response.status);
    }
    return data;
  },

  async getTutorials(filters?: { category?: string; difficulty?: string }) {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    
    const response = await fetch(`${API_BASE_URL}/tutorials?${params}`);
    const data = await response.json();
    if (!response.ok) {
      throw new ApiError(data.message || 'Failed to get tutorials', data, response.status);
    }
    return data;
  },

  async getTutorial(tutorialId: string) {
    const response = await fetch(`${API_BASE_URL}/tutorials/${tutorialId}`);
    const data = await response.json();
    if (!response.ok) {
      throw new ApiError(data.message || 'Failed to get tutorial', data, response.status);
    }
    return data;
  },

  async updateTutorialProgress(token: string, tutorialId: string, stepNumber: number, completed: boolean) {
    const response = await fetch(`${API_BASE_URL}/tutorials/${tutorialId}/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ stepNumber, completed }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new ApiError(data.message || 'Failed to update progress', data, response.status);
    }
    return data;
  },

  async getTutorialProgress(token: string, tutorialId: string) {
    const response = await fetch(`${API_BASE_URL}/tutorials/${tutorialId}/progress`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new ApiError(data.message || 'Failed to get progress', data, response.status);
    }
    return data;
  },

  async getUserProgress(token: string) {
    const response = await fetch(`${API_BASE_URL}/tutorials/user/progress`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new ApiError(data.message || 'Failed to get user progress', data, response.status);
    }
    return data;
  },
};
