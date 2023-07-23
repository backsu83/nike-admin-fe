import 'app.module.scss'
import React from 'react'
import ReactDOM from 'react-dom'
// import { Provider } from 'react-redux';
// import store from './store';
import Pages from 'pages'
import { QueryClient, QueryClientProvider } from 'react-query'
import { HashRouter, Route, Routes } from 'react-router-dom'
import App from './App'

const queryClient = new QueryClient()

ReactDOM.render(
    <HashRouter>
        {/* <Provider store={store}> */}
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </React.StrictMode>
        {/* </Provider> */}
    </HashRouter>,
    document.getElementById('root')
)

ReactDOM.render(
    <HashRouter>
        <React.StrictMode>
            <Routes>
                <Route
                    path='/image'
                    element={<Pages.PhotoScan />}
                />
            </Routes>
        </React.StrictMode>
    </HashRouter>,
    document.getElementById('scan')
)
