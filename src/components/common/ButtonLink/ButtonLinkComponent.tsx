import Link, {LinkProps} from 'next/link';
import React, {PropsWithChildren} from 'react';
import {LinkProps as MUILinkProps} from "@material-ui/core";


interface Props extends LinkProps {
    className: string;
    hrefAs: string;
    children: string;
}

const ButtonLinkComponent = React.forwardRef<MUILinkProps, PropsWithChildren<Props>>(({className, href, hrefAs, children, prefetch}, ref) => (
    <Link href={href} as={hrefAs} prefetch={prefetch}>
        <a className={className}>
            {children}
        </a>
    </Link>
));

export default ButtonLinkComponent;