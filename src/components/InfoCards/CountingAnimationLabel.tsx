import { Box, Text } from "@mantine/core";
import React, { createRef, useRef } from "react";
import { useCountUp } from "react-countup";
import { isSmallScreen } from "../../utils/scroll";
import {
  CountHookResult,
  CountingAnimationLabelProps,
} from "../../utils/types";

// Counting Hook
function CountHook({ finalValue }: { finalValue: number }): CountHookResult {
  const countUpRef = createRef<HTMLSpanElement>();
  const hasAnimatedRef = useRef(false);

  const countUp = useCountUp({
    ref: countUpRef,
    start: Math.floor(finalValue - finalValue / 5),
    end: finalValue,
    duration: 2,
    startOnMount: false,
  });

  const startAnimation = () => {
    if (!hasAnimatedRef.current) {
      countUp.start();
      hasAnimatedRef.current = true;
    }
  };

  return {
    ref: countUpRef,
    startAnimation,
  };
}

// Counting Label
export default function CountingAnimationLabel({
  counterAnimationInfo,
}: CountingAnimationLabelProps) {
  const statBreakpoint = isSmallScreen ? "" : ", ";
  const containerRef = useRef<HTMLDivElement>(null);
  const countHooks = counterAnimationInfo.map(({ finalValue }) =>
    CountHook({ finalValue }),
  );

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          countHooks.forEach((hook) => hook.startAnimation());
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.disconnect();
      }
    };
  }, [countHooks]);

  return (
    <Box
      ref={containerRef}
      mb={{ base: 5, sm: 0 }}
      style={{
        display: "flex",
        flexDirection: isSmallScreen ? "column" : "row",
        alignItems: isSmallScreen ? "flex-start" : "flex-end",
        gap: 5,
      }}
    >
      {counterAnimationInfo.map(({ label, finalValue }, index) => (
        <Text fz={{ base: 16, sm: 20 }} lh={1} key={label}>
          <Text span c="main" fz={{ base: 16, sm: 20 }} fw={700} inherit>
            ~
            {countHooks[index] ? (
              <span ref={countHooks[index].ref}>{finalValue}</span>
            ) : (
              <span>{finalValue}</span>
            )}
          </Text>{" "}
          {label}
          {index < counterAnimationInfo.length - 1 && statBreakpoint}
        </Text>
      ))}
    </Box>
  );
}
