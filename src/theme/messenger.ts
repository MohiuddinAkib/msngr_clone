import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import responsiveFontSizes from "@material-ui/core/styles/responsiveFontSizes";


export const makeMessengerTheme = (darkMode: boolean) => responsiveFontSizes(createMuiTheme({
    palette: {
        type: darkMode ? "dark" : "light"
    }
}))