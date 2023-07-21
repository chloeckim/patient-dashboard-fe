import React from "react"
import { AppBar, Avatar, Button, Container, Toolbar } from "@mui/material"
import { signInWithGoogle, logOut } from "../auth/auth-google"
import { User } from "firebase/auth"

type PropsType = {
  user: User | null
}

export default function NavBar({ user }: PropsType) {
  return (
    <AppBar position="static" color="default" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters className="flex flex-row justify-between">
          <a href="/" className="font-mono font-bold text-xl">
            Patient Dashboard
          </a>
          {user === null ? (
            <Button
              color="inherit"
              variant="outlined"
              onClick={signInWithGoogle}
            >
              Sign in with Google
            </Button>
          ) : (
            <div className="flex flex-row gap-4">
              <Button color="inherit" onClick={logOut}>
                Sign out
              </Button>
              {user.photoURL !== null && (
                <Avatar alt="user avatar" src={user.photoURL} />
              )}
            </div>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  )
}
