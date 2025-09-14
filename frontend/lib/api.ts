// API configuration and utilities for connecting to the backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

interface SignupRequest {
  username?: string
  email: string
  company?: string
}

interface SignupResponse {
  message: string
}

interface VerifyRequest {
  email: string
  otp: string
}

interface VerifyResponse {
  success: boolean
  message: string
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    
    // Handle network errors, CORS issues, etc.
    if (error instanceof Error) {
      throw new ApiError(0, `Network error: ${error.message}`)
    }
    
    throw new ApiError(0, 'Unknown error occurred')
  }
}

// API functions
export const api = {
  // Test if backend is available
  async checkStatus(): Promise<{ status: string }> {
    return apiRequest('/status')
  },

  // Sign up a new user
  async signup(data: SignupRequest): Promise<SignupResponse> {
    return apiRequest('/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Verify email with OTP
  async verify(data: VerifyRequest): Promise<VerifyResponse> {
    return apiRequest('/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Get options for credential creation
  async getCredentialOptions(email: string): Promise<any> {
    // Send email as a query parameter (GET)
    const params = new URLSearchParams({ email }).toString();
    return apiRequest(`/webauthn/register?${params}`);
  },

  async submitCredentials(credential: any, email: string): Promise<any> {
    return apiRequest('/webauthn/register/submit', {
      method: 'POST',
      body: JSON.stringify({
        credential,
        email
      })
    });
  },

  // Get emails (for testing)
  async getEmails(): Promise<any> {
    return apiRequest('/emails')
  },
}

export { ApiError }
export type { SignupRequest, SignupResponse, VerifyRequest, VerifyResponse }
