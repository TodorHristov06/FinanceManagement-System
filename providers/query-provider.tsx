// In Next.js, this file would be called: app/providers.tsx
'use client'

// Prevent refetching immediately by setting a default stale time of 1 minute
// Since QueryClientProvider relies on useContext under the hood, we have to put 'use client' on top
// Necessary for the QueryClientProvider to work on the client  (comment)
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

// Function to create a new QueryClient with default settings (comment)
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Prevent refetching immediately by setting a default stale time of 1 minute (comment)

        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  })
}
// Query client for the browser, initialized only once (comment)
let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (isServer) {
    // On the server, always create a new QueryClient instance (comment)

    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client

     // On the browser, reuse the same QueryClient to avoid issues during initial rendering (comment)
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

type Props = {
  children: React.ReactNode
}
// QueryProvider Component (comment)
export function QueryProvider({ children }: Props) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  // Get the appropriate QueryClient based on the environment (server or browser) (comment)
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
  const queryClient = getQueryClient()

  return (
    // Wrap children with QueryClientProvider to provide access to React Query features (comment)
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}