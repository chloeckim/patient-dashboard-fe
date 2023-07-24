import {
  AppBar,
  Avatar,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material"
import { signInWithGoogle, logOut } from "../auth/auth-google"
import { User } from "firebase/auth"

type PropsType = {
  user: User | null
}

export default function NavBar({ user }: PropsType) {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters className="flex flex-row justify-between my-2">
          <a href="/" className="font-bold text-xl">
            <Typography variant="h6" letterSpacing={0}>
              Patient Dashboard
            </Typography>
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
