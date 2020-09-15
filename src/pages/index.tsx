import React from "react"
import {NextPage} from "next";
import MessengerLayout from "@src/layouts/MessengerLayout";

const Home: NextPage = (props) => {
    React.useEffect(() => {

    }, [])

    return (
        <MessengerLayout>
            hello
        </MessengerLayout>
    );
};

export default Home;
