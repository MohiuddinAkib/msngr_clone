import React from "react";
import { Root, getDefaultScheme } from "@mui-treasury/layout";

const scheme = getDefaultScheme()

const HomeLayout: React.FC = (props) => {
    return (
        <Root
            scheme={scheme}
        >

        </Root>
    );
};

export default HomeLayout;