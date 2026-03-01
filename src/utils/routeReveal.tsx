import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";

type SetRouteRevealBlocker = (id: string, blocked: boolean) => void;

const RouteRevealContext = createContext<SetRouteRevealBlocker | null>(null);

type RouteRevealBoundaryProps = {
  children: ReactNode;
};

export function RouteRevealBoundary({ children }: RouteRevealBoundaryProps) {
  const [blockedIds, setBlockedIds] = useState<Set<string>>(() => new Set());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (blockedIds.size > 0) {
      setIsReady(false);
      return;
    }
    if (typeof window === "undefined") {
      setIsReady(true);
      return;
    }

    let frameA = 0;
    let frameB = 0;
    frameA = window.requestAnimationFrame(() => {
      frameB = window.requestAnimationFrame(() => {
        setIsReady(true);
      });
    });

    return () => {
      window.cancelAnimationFrame(frameA);
      window.cancelAnimationFrame(frameB);
    };
  }, [blockedIds]);

  const setBlocker = useCallback<SetRouteRevealBlocker>((id, blocked) => {
    setBlockedIds((previous) => {
      const isAlreadyBlocked = previous.has(id);
      if (isAlreadyBlocked === blocked) return previous;

      const next = new Set(previous);
      if (blocked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);

  return (
    <RouteRevealContext.Provider value={setBlocker}>
      <div className={`route-reveal${isReady ? " route-reveal-ready" : ""}`}>
        {children}
      </div>
    </RouteRevealContext.Provider>
  );
}

export function useRouteRevealBlocker(id: string, blocked: boolean) {
  const setBlocker = useContext(RouteRevealContext);

  useLayoutEffect(() => {
    if (!setBlocker) return;
    setBlocker(id, blocked);
    return () => {
      setBlocker(id, false);
    };
  }, [blocked, id, setBlocker]);
}
