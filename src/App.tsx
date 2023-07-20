import React, { useEffect, useState } from "react"
import NavBar from "./components/NavBar"
import { auth } from "./config/firebase"
import { User } from "firebase/auth"
import Dashboard from "./components/Dashboard"

function App() {
  // Auth logic referenced from https://rnfirebase.io/auth/usage
  const [initializing, setInitializing] = useState<boolean>(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged((user: User | null) => {
      setUser(user)
      if (initializing) setInitializing(false)
    })
    return subscriber // unsubscribe on unmount
  }, [])

  if (initializing) return null

  return (
    <div className="App">
      <NavBar user={user} />
      {user !== null && <Dashboard user={user} />}
    </div>
  )
}

export default App
