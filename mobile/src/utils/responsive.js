import { useWindowDimensions } from "react-native";

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();

  const isTablet = width >= 768;
  const isSmallPhone = width < 380;

  const pagePadding = isTablet ? 32 : 16;
  const authCardMaxWidth = isTablet ? 480 : "100%";

  const productColumns = width >= 1000 ? 3 : width >= 650 ? 2 : 1;

  return {
    width,
    height,
    isTablet,
    isSmallPhone,
    pagePadding,
    authCardMaxWidth,
    productColumns,
  };
};