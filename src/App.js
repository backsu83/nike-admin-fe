import Pages from 'pages'
import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

export default function App() {
    const { pathname } = useLocation()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return (
        <Routes>
            <Route
                path='/'
                element={<Pages.MainPage />}
            />

            <Route
                path='/order/list'
                element={<Pages.OrderListPage />}
            />
            <Route
                path='/order/detail/:type/:id'
                element={<Pages.OrderDetailPage />}
            />

            <Route
                path='/product/list'
                element={<Pages.ProductListPage />}
            />
            <Route
                path='/product/option'
                element={<Pages.OptionDetailPage />}
            />
            <Route
                path='/product/add'
                element={<Pages.ProductAddPage />}
            />
            <Route
                path='/product/edit/:id'
                element={<Pages.ProductEditPage />}
            />
            <Route
                path='/product/asset/edit/:id'
                element={<Pages.AssetEditPage />}
            />
            <Route
                path='/product/embroidery/edit/:id'
                element={<Pages.EmbroideryEditPage />}
            />
            <Route
                path='/product/basic/edit/:type/:id'
                element={<Pages.BasicEditPage />}
            />
        </Routes>
    )
}
