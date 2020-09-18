import React from "react";
import {NextPage} from "next";
import NextLink from "next/link";
import Grid from "@material-ui/core/Grid";
import {Field, Form, Formik} from "formik";
import Paper from "@material-ui/core/Paper";
import AuthLayout from "@layouts/AuthLayout";
import {TextField} from "formik-material-ui";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {makeStyles, createStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => createStyles({
    container: {
        height: "100vh"
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        backgroundColor: theme.palette.secondary.main,
        margin: "auto",
        marginBottom: theme.spacing(1),
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const Login: NextPage = () => {
    const classes = useStyles();

    const initialValues = {
        email: "",
        password: "",
    }

    const handleFormSubmit = (values: typeof initialValues) => {
        console.log(values)
    }

    return (
        <AuthLayout>
            <Grid
                container
                justify={"center"}
                alignItems={"center"}
                className={classes.container}
            >
                <Grid
                    item
                    md={7}
                >
                    <Paper>
                        <CardContent>
                            <Avatar
                                className={classes.avatar}
                            >
                                <LockOutlinedIcon/>
                            </Avatar>

                            <Typography
                                variant="h5"
                                component="h1"
                                align={"center"}
                            >
                                Sign in
                            </Typography>

                            <Formik
                                initialValues={initialValues}
                                onSubmit={handleFormSubmit}
                            >
                                <Form
                                    className={classes.form}
                                >
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

                                    <Button
                                        fullWidth
                                        type="submit"
                                        color="primary"
                                        variant="contained"
                                        className={classes.submit}
                                    >
                                        Sign In
                                    </Button>
                                </Form>
                            </Formik>
                        </CardContent>
                        <CardActions>
                            <Grid
                                container
                            >
                                <Grid
                                    xs
                                    item
                                >
                                    <NextLink
                                        href={"/forgot-password"}
                                    >
                                        <Typography
                                            component={"a"}
                                            variant={"body2"}
                                        >
                                            Forgot password?
                                        </Typography>
                                    </NextLink>
                                </Grid>
                                <Grid
                                    item
                                >
                                    <NextLink
                                        href={"/register"}
                                    >
                                        <Typography
                                            component={"a"}
                                            variant={"body2"}
                                        >
                                            Don't have an account? Sign Up
                                        </Typography>
                                    </NextLink>
                                </Grid>
                            </Grid>
                        </CardActions>
                    </Paper>
                </Grid>
            </Grid>
        </AuthLayout>
    );
};

export default Login;