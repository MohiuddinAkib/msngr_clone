import React from "react";
import IGif from "@giphy/js-types/dist/gif";
import {Carousel, SearchContext, SuggestionBar} from "@giphy/react-components"
import TextField from "@material-ui/core/TextField";

interface Props {
    columns?: number;
    width?: number;
    initialTerm?: string;
    onGifClick: (gif: IGif, e: React.SyntheticEvent<HTMLElement, Event>) => void;
}

const GifPickerComponent: React.FC<Props> = (props) => {
    const [searchTerm, setSearchTerm] = React.useState("")
    const {fetchGifs, searchKey, setSearch} = React.useContext(SearchContext)

    React.useEffect(() => {
        setSearchTerm(searchKey)
    }, [searchKey])

    const handleSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const handleSearchTermEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            if (!!searchTerm) {
                setSearch(searchTerm)
            }
        }
    }

    return (
        <>
            <TextField
                fullWidth
                value={searchTerm}
                variant={"outlined"}
                onChange={handleSearchTerm}
                onKeyPress={handleSearchTermEnterPress}
            />
            <SuggestionBar/>
            <Carousel
                noLink
                key={searchKey}
                gifHeight={200}
                // width={props.width}
                fetchGifs={fetchGifs}
                // columns={props.columns}
                // className={classes.grid}
                onGifClick={props.onGifClick}
            />
        </>
    );
};

GifPickerComponent.defaultProps = {
    width: 800,
    columns: 3,
    initialTerm: "vegeta"
}

export default GifPickerComponent;