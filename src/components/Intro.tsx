import { useNavigate } from "react-router-dom"
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Unstable_Grid2 as Grid,
  Typography,
} from "@mui/material"

import { SIGN_IN } from "../constants/routes"
import { useTransition } from "react"

const Intro = () => {
  const [, startTransition] = useTransition()
  const navigate = useNavigate()

  return (
    <Container maxWidth="sm">
      <Typography variant="h1" component="h1">
        Budge IT
      </Typography>
      <Grid container spacing={2}>
        <Grid xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">I want it</Typography>
            </CardContent>
            <CardActions>
              <Button variant="contained">Register</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">I have it</Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                onClick={() => startTransition(() => navigate(SIGN_IN))}
              >
                Sign in
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid xs={12}>
          <Card sx={{ flexDirection: "column" }}>
            <CardContent>Intro</CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}
export default Intro
