import {NextPage} from "next";
import {useRouter} from "next/router";

const User: NextPage = (props) => {
    const router = useRouter();

    return <div>this is single user {router.query.slug}</div>;
};

export default User;
