'use client';
import { QueryClientProvider } from 'react-query';
import { queryClient } from '@/libs/react-query';

export default function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
