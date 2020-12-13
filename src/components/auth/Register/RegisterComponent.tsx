import React from "react";
import NextLink from "next/link";
import useAuth from "@hooks/useAuth";
import Grid from "@material-ui/core/Grid";
import { Field, Form, Formik } from "formik";
import Paper from "@material-ui/core/Paper";
import { TextField } from "formik-material-ui";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      height: "100vh",
    },
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    avatar: {
      backgroundColor: theme.palette.secondary.main,
      margin: "auto",
      marginBottom: theme.spacing(1),
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  })
);

const RegisterComponent = () => {
  const auth = useAuth();
  const classes = useStyles();

  const handleFormSubmit = (
    values: typeof auth.initialRegisterValues,
    helpers
  ) => {
    auth.handleRegister(values);
  };

  return (
    <Grid
      container
      justify={"center"}
      alignItems={"center"}
      className={classes.container}
    >
      <Grid item md={7}>
        <Paper>
          <CardContent>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>

            <Typography variant="h5" component="h1" align={"center"}>
              Sign Up
            </Typography>

            <Formik
              initialValues={auth.initialRegisterValues}
              onSubmit={handleFormSubmit}
            >
              <Form className={classes.form}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Field
                      required
                      fullWidth
                      autoFocus
                      id="first_name"
                      name="first_name"
                      margin="normal"
                      variant="outlined"
                      label="First Name"
                      component={TextField}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field
                      required
                      fullWidth
                      autoFocus
                      id="last_name"
                      margin="normal"
                      name="last_name"
                      variant="outlined"
                      label="Last Name"
                      component={TextField}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      required
                      fullWidth
                      autoFocus
                      id="email"
                      name="email"
                      margin="normal"
                      variant="outlined"
                      autoComplete="email"
                      label="Email Address"
                      component={TextField}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      required
                      fullWidth
                      id="password"
                      name="password"
                      type="password"
                      margin="normal"
                      label="Password"
                      variant="outlined"
                      component={TextField}
                      autoComplete="current-password"
                    />
                  </Grid>
                </Grid>

                <Button
                  fullWidth
                  type="submit"
                  color="primary"
                  variant="contained"
                  className={classes.submit}
                >
                  Sign Up
                </Button>
              </Form>
            </Formik>
          </CardContent>
          <CardActions>
            <Grid container justify={"flex-end"}>
              <Grid item>
                <NextLink href={"/login"}>
                  <Typography component={"a"} variant={"body2"}>
                    Already have an account? Sign in
                  </Typography>
                </NextLink>
              </Grid>
            </Grid>
          </CardActions>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default RegisterComponent;
