'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { Toaster } from 'react-hot-toast';

const memberTheme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: "#F5F7FA",
      100: "#E4E7EB",
      200: "#CBD2D9",
      300: "#9AA5B1",
      400: "#7B8794",
      500: "#616E7C",
      600: "#52606D",
      700: "#3E4C59",
      800: "#323F4B",
      900: "#1F2933",
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: "brand",
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: "brand.500",
      },
    },
    Select: {
      defaultProps: {
        focusBorderColor: "brand.500",
      },
    },
  },
});

export function MemberProviders({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={memberTheme}>
        <Toaster position="top-center" />
        {children}
      </ChakraProvider>
    </CacheProvider>
  );
} 