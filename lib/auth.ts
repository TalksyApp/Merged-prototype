// In production, replace with proper NextAuth implementation

export interface SessionUser {
  id: string
  email: string
  name: string
}

export interface Session {
  user: SessionUser
}

// Client-side session management
export const getSession = async (): Promise<Session | null> => {
  if (typeof window === "undefined") return null
  
  const sessionData = localStorage.getItem("session")
  if (!sessionData) return null
  
  try {
    return JSON.parse(sessionData)
  } catch {
    return null
  }
}

export const setSession = (session: Session | null) => {
  if (typeof window === "undefined") return
  
  if (session) {
    localStorage.setItem("session", JSON.stringify(session))
  } else {
    localStorage.removeItem("session")
  }
}

export const signOut = () => {
  if (typeof window === "undefined") return
  localStorage.removeItem("session")
  window.location.href = "/auth/signin"
}

export const signIn = async (email: string, password: string): Promise<Session> => {
  // For preview: Simple validation
  // In production: Send to API route for secure authentication
  if (!email || !password) {
    throw new Error("Email and password required")
  }

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500))

  const session: Session = {
    user: {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split("@")[0],
    },
  }

  setSession(session)
  return session
}

export const signUp = async (
  email: string,
  password: string,
  username: string
): Promise<Session> => {
  if (!email || !password || !username) {
    throw new Error("All fields required")
  }

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500))

  const session: Session = {
    user: {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: username,
    },
  }

  setSession(session)
  return session
}


export const auth = async () => {
  // In preview: API routes can't access localStorage directly
  // Return null - in production with NextAuth, this would check JWT tokens
  if (typeof window !== "undefined") {
    const sessionData = localStorage.getItem("session")
    if (sessionData) {
      try {
        return JSON.parse(sessionData)
      } catch {
        return null
      }
    }
  }
  return null
}
