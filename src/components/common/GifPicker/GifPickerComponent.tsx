import React from "react";
import {GiphyFetch} from "@giphy/js-fetch-api"
import {Grid, SearchBar, SearchContext, SearchContextManager, SuggestionBar} from "@giphy/react-components"

interface Props {
    columns?: number;
    width?: number;
}

const gf = new GiphyFetch(process.env.NEXT_PUBLIC_GIPHY_SDK_API_KEY)
// const fetchGifs = (offset: number) => gf.trending({offset, limit: 10})

const GifPickerComponent: React.FC<Props> = (props) => {
        const {fetchGifs, searchKey} = React.useContext(SearchContext)

        console.log(props.width)

        return (
            <>
                {/*<SearchContextManager apiKey={process.env.NEXT_PUBLIC_GIPHY_SDK_API_KEY}>*/}
                {/*    <SearchBar/>*/}
                {/*    <SuggestionBar/>*/}
                <Grid
                    noLink
                    width={props.width}
                    onGifClick={() => {
                    }}
                    fetchGifs={fetchGifs}
                    columns={props.columns}
                />
                {/*</SearchContextManager>*/}
            </>
        );
    }
;

GifPickerComponent.defaultProps = {
    width: 800,
    columns: 3
}

export default GifPickerComponent;