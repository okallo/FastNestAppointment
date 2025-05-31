import { ActionContext } from 'vuex'

interface State {
  user: any // Define your user type here
}

interface Credentials {
  email: string
  password: string
}

export const actions = {
  async login(context: ActionContext<State, any>, credentials: Credentials): Promise<void> {
    // Example: Call API to login
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      // Throw an error that includes response data for catching later
      const errorData = await response.json()
      const error = new Error(errorData.message || 'Login failed')
      // Attach the response for more info in catch block
      ;(error as any).response = { data: errorData }
      throw error
    }

    const userData = await response.json()
    context.commit('setUser', userData)
  },
}
