import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import responsiveFontSizes from "@material-ui/core/styles/responsiveFontSizes";

const lightTheme = createMuiTheme({
    palette: {
        type:  "light"
    }
})

const darkTheme = createMuiTheme({
    palette: {
        type:  "dark"
    }
})

export const makeApplicationTheme = (darkMode: boolean) => responsiveFontSizes(darkMode ? darkTheme : lightTheme)