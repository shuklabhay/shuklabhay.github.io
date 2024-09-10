import { Text } from "@mantine/core";
import { useCountUp } from "react-countup";
import { isSmallScreen } from "../../utils/scroll";
import { counterAnimationInfo } from "../../utils/types";

export default function CountingAnimationLabel({
  counterAnimationInfo,
}: {
  counterAnimationInfo: counterAnimationInfo[];
}) {
  const statBreakpoint = isSmallScreen ? "" : ", ";

  function CountHook({
    label,
    finalValue,
  }: {
    label: string;
    finalValue: number;
  }) {
    const counterLabel = `counter-${label}`;
    useCountUp({
      ref: counterLabel,
      start: Math.floor(finalValue - 15),
      end: finalValue,
    });
    return <span id={counterLabel} />;
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          gap: 5,
        }}
      >
        {counterAnimationInfo.map(({ label, finalValue }, index) => {
          return (
            <>
              <Text fz={{ base: 16, sm: 20 }} lh={1.25}>
                <Text
                  span
                  c="main"
                  fz={{ base: 16, sm: 20 }}
                  fw={700}
                  lh={1.25}
                >
                  <CountHook label={label} finalValue={finalValue} />
                </Text>{" "}
                {label}
                {index < counterAnimationInfo.length - 1 && statBreakpoint}
              </Text>
            </>
          );
        })}
      </div>
    </>
  );
}
