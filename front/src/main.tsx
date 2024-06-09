import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient({
  // queryCache: new QueryCache({
  //   // onError: (error: any, query: Query) => {
  //   //   // 🎉 only show error toasts if we already have data in the cache
  //   //   // which indicates a failed background update
  //   //   // if (query.state.error) {
  //   //     toast.error(`Something went wrong: ${error.message}`)
  //   //   // }
  //   // },
  // }),
})
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* <ReactQueryDevtools initialIsOpen /> */}
    </QueryClientProvider>
  </React.StrictMode>,
)
