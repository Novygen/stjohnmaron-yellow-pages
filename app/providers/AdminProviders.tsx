'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { rehydrateAdmin } from '@/store/slices/adminSlice';

const adminTheme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: "#E6F6FF",
      100: "#BAE3FF",
      200: "#7CC4FA",
      300: "#47A3F3",
      400: "#2186EB",
      500: "#0967D2",
      600: "#0552B5",
      700: "#03449E",
      800: "#01337D",
      900: "#002159",
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

function AdminPersistenceManager() {
  const dispatch = useDispatch();

  useEffect(() => {
    const savedAdmin = localStorage.getItem("admin");
    if (savedAdmin) {
      try {
        const parsedAdmin = JSON.parse(savedAdmin);
        dispatch(rehydrateAdmin(parsedAdmin));
      } catch (error) {
        console.error("Error parsing saved admin data:", error);
        localStorage.removeItem("admin");
      }
    }
  }, [dispatch]);

  return null;
}

export function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AdminPersistenceManager />
        <CacheProvider>
          <ChakraProvider theme={adminTheme}>
            {children}
          </ChakraProvider>
        </CacheProvider>
      </PersistGate>
    </Provider>
  );
} 