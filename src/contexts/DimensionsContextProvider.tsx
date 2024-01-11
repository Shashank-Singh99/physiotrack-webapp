import { createContext, useEffect, useState } from "react";

export type DimensionsContextType = {
  clientWidth: number;
  clientHeight: number;
};

export const DimensionsContext = createContext<DimensionsContextType>({
  clientWidth: undefined,
  clientHeight: undefined,
});

export const DimensionsContextProvider = ({ children }) => {
  const [clientHeight, setClientHeight] = useState<number>(undefined);
  const [clientWidth, setClientWidth] = useState<number>(undefined);

  useEffect(() => {
    const parentElement = document.getElementById("parent") as HTMLElement;

    if (!parentElement) return;
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setClientWidth(parentElement.clientWidth);
      setClientHeight(parentElement.clientHeight);
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return (
    <DimensionsContext.Provider value={{ clientHeight, clientWidth }}>
      {children}
    </DimensionsContext.Provider>
  );
};
