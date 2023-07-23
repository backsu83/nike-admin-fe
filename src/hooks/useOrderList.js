import API from 'api'
import { useQuery } from 'react-query'

const useListState = (type, filter) => {
    const urlConvert = () => {
        let url = `order`
        for (let key in filter) {
            if (filter[key] && key != 'category') url += (url[url.length - 1] === '&' ? '' : '?') + key + '=' + filter[key] + '&'
        }
        if (url[url.length - 1] === '&') url = url.slice(0, -1)
        return url
    }
    const { data, isLoading, refetch } = useQuery(['@getOrderList'], () => API.getOrderList(filter), {
        select: (data) => {
            return data.map((value) => {
                if (filter.category) value.isHide = !filter.category[value.category].checked
                else value.isHide = false
            })
        },
        onSuccess: (data) => {
            console.log(data)
        },
        onError: (e) => {
            console.log(e)
        },
        cacheTime: 5000,
    })

    // useEffect(() => {
    //     getOrderList(filter || {})
    // }, [type])
    // const executeCallback = () => {
    //     getOrderList(filter || {})
    // }
    // let timerId = setInterval(executeCallback, 5000)

    // useEffect(() => {
    //     refetch()
    // }, [filter])

    // useEffect(() => {
    //     if (list.length > 0) {
    //         timerId = setInterval(getOrderList(filter), 5000)
    //     } else {
    //         clearInterval(timerId)
    //     }
    //     console.log(data)
    // }, [list])

    // const getOrderList = (filter) => {
    //     let url = `order`
    //     for (let key in filter) {
    //         if (filter[key] && key != 'category') url += (url[url.length - 1] === '&' ? '' : '?') + key + '=' + filter[key] + '&'
    //     }
    //     if (url[url.length - 1] === '&') url = url.slice(0, -1)

    //     return API.getOrders(url)
    //     // setList([...(list && list.order_list ? list.order_list : [])])
    //     // setList(list.order_list)
    // }

    return [data, isLoading, refetch]
}

export default useListState
