import { Link, useLocation, useNavigate } from "../router";
import type { LinkProps } from "../router";
import type { MouseEvent as ReactMouseEvent } from "react";
import { navigateWithRouteTransition } from "../utils/routeTransitions";

type TransitionLinkProps = Omit<LinkProps, "to" | "viewTransition"> & {
  to: string;
  prepare?: () => Promise<unknown>;
};

export default function TransitionLink({
  to,
  prepare,
  state,
  replace,
  onClick,
  ...rest
}: TransitionLinkProps): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
      return;

    event.preventDefault();
    if (location.pathname === to) return;
    navigateWithRouteTransition(
      navigate,
      to,
      {
        state,
        replace,
      },
      prepare,
    );
  };

  return (
    <Link
      to={to}
      state={state}
      replace={replace}
      onClick={handleClick}
      {...rest}
    />
  );
}
