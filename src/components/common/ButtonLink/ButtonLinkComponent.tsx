import Link, { LinkProps } from "next/link";
import MUILink from "@material-ui/core/Link";
import { LinkProps as MUILinkProps, TypographyProps } from "@material-ui/core";
import React, { PropsWithChildren } from "react";

interface Props {
  children: string;
  className?: string;
  component?: string;
}

const ButtonLinkComponent = React.forwardRef<
  HTMLAnchorElement,
  PropsWithChildren<Props & LinkProps & MUILinkProps & TypographyProps>
>(({ className, href, as, children, prefetch, ...rest }, ref) => (
  <Link href={href} as={as} prefetch={prefetch}>
    <MUILink className={className} {...rest}>
      {children}
    </MUILink>
  </Link>
));

ButtonLinkComponent.defaultProps = {
  className: "",
  component: "a",
};

export default ButtonLinkComponent;
