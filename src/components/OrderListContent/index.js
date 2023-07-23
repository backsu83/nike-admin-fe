import API from 'api'
import { SearchBar } from 'components'
import useProductList from 'hooks/useProductList'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { numberWithCommas } from 'utils/Commas'
import styles from './style.module.scss'

function OrderListContent() {
    const navigate = useNavigate()
    const [filter, setFilter] = useState({
        category: {
            ALL: { checked: true },
            QR: { checked: true },
            laser: { checked: true },
            print: { checked: true },
            embroidery: { checked: true },
        },
        start: null,
        end: null,
        keyword: '',
        dayAgo: '1',
    })
    const [products] = useProductList()
    // const [list, isLoading, refreshEvent] = useOrderList(null, filter)
    const [tabIndex, setTabIndex] = useState(0)
    const [optionMap, setOptionMap] = useState({})
    const [list, setList] = useState([])

    const getOrderList = (filter) => {
        let url = `order`
        for (let key in filter) {
            if (filter[key] && key != 'category') url += (url[url.length - 1] === '&' ? '' : '?') + key + '=' + filter[key] + '&'
        }
        if (url[url.length - 1] === '&') url = url.slice(0, -1)

        return API.getOrders(url)
        // setList([...(list && list.order_list ? list.order_list : [])])
        // setList(list.order_list)
    }

    const { trash, isLoading, refetch } = useQuery(['@getOrderList'], () => getOrderList(filter), {
        onSuccess: (data) => {
            // list 의 종속성 떄문에 trash(익명): data는 안씀
            setList(data.order_list)
        },
        onError: (e) => {
            console.log(e)
        },
        cacheTime: 5000,
    })

    const LinkClick = (value, path) => {
        return navigate(`/order/detail/${value.category}/${path}`, { state: value })
    }

    const activeStyle = (type) => {
        const ORDER_STATE = { QR: { color: '#2266AB' }, print: { color: '#22AB2E' }, embroidery: { color: '#5C22AB' }, laser: { color: '#AB3222' } }
        return ORDER_STATE[type] ? ORDER_STATE[type].color : '#2266AB'
    }
    const detailTitle = (type) => {
        const ORDER_STATE = {
            QR: { title: 'PHOTO SCAN PRINTING' },
            print: { title: 'NBY DIGITAL PRINTING' },
            laser: { title: 'LASER GUN PRINTING' },
            embroidery: { title: 'EMBROIDERY' },
        }
        return ORDER_STATE[type] ? ORDER_STATE[type].title : 'PHOTO SCAN PRINTING'
    }

    function getListLength(paramList) {
        return paramList && paramList.filter((v) => filter.category[v.category].checked || filter.category['ALL'].checked).length
    }

    const getTotalPrice = (value) => {
        let state = value

        state.price = optionMap[value.option_id] && optionMap[value.option_id].product ? optionMap[value.option_id].product.price : 0
        const categoryPrice = { QR: 15000, print: 15000, embroidery: 3000, laser: 3000, laser_pre: 3000 }
        let frontCount = state.assets ? state.assets.length : 0
        let resultPrice = 0

        if (state.category === 'embroidery') {
            resultPrice =
                state.price +
                (optionMap[value.option_id] && optionMap[value.option_id].option ? optionMap[value.option_id].option.price : 0) +
                categoryPrice[state.category]
        } else if (state.category === 'laser' || state.category === 'laser_pre') {
            resultPrice = state.price + categoryPrice[state.category]
        } else {
            resultPrice =
                state.price +
                (optionMap[value.option_id] && optionMap[value.option_id].option ? optionMap[value.option_id].option.price : 0) +
                (state.work_img ? 1 : 0) * categoryPrice[state.category] +
                (state.work_img_back ? 1 : 0) * categoryPrice[state.category]
        }

        return resultPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }

    function getModifyDate(value) {
        try {
            let date = new Date(value.modified_at.replace('T', ' ').split('.')[0])
            const time = new Date(value.modified_at)
            date.setHours(date.getHours() + 9)
            time.setHours(date.getHours() + 9)

            function zeroCheck(num) {
                return num < 10 ? '0' + num : num
            }
            return (
                date.getFullYear().toString().slice(2, 4) +
                '.' +
                zeroCheck(date.getMonth() + 1) +
                '.' +
                zeroCheck(date.getDate()) +
                ` ${zeroCheck(time.getHours())}:${zeroCheck(time.getMinutes())}`
            )
        } catch (e) {
            return ''
        }
    }

    useEffect(() => {
        // setList((l) => {
        //     l.map((value) => {
        //         if (filter.category) value.isHide = !filter.category[value.category].checked
        //         else value.isHide = false
        //     })
        //     return [...l]
        // })
        refetch()
        // getOrder()
        // refreshEvent(filter)
    }, [filter])

    useEffect(() => {
        let objectMap = {}
        products.map((value) => {
            value.options &&
                value.options.map((v) => {
                    objectMap[v.id] = { option: v, product: value }
                })
        })
        setOptionMap(objectMap)
    }, [products])

    if (isLoading) {
        return (
            <div className={styles.Container}>
                <SearchBar
                    tabIndex={tabIndex}
                    setTabIndex={setTabIndex}
                    filter={filter}
                    setFilter={setFilter}
                />
                <div className={styles.OrderListWrap}>
                    <div className={styles.OrderInner}>
                        <p>Loading...</p>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className={styles.Container}>
            <SearchBar
                tabIndex={tabIndex}
                setTabIndex={setTabIndex}
                filter={filter}
                setFilter={setFilter}
            />
            <div className={styles.OrderListWrap}>
                <div className={styles.OrderInner}>
                    <div className={styles.OrderBox}>
                        <p className={styles.OrderTitle}>
                            작업대기
                            <span>{list && list.length > 0 ? getListLength(list.filter((v) => v.status === 'order')) : '0'}개</span>
                        </p>
                        <div className={styles.ListWrap}>
                            {list &&
                                list.length > 0 &&
                                list
                                    .filter((v) => v.status === 'order' && (filter.category[v.category].checked || filter.category['ALL'].checked))
                                    .map((value, index) => {
                                        return (
                                            <div
                                                className={styles.ListBox}
                                                key={index}>
                                                <div
                                                    style={{ backgroundColor: activeStyle(value.category) }}
                                                    className={styles.ListTitleBox}>
                                                    <p>{detailTitle(value.category)}</p> <span>{getModifyDate(value)}</span>
                                                </div>
                                                <div className={styles.ListContent}>
                                                    {/*<p>NAME : {value.name}</p>*/}
                                                    <p>PHONE : {value.phone}</p>
                                                    <p>
                                                        총 결제 금액 : <span>{numberWithCommas(getTotalPrice(value))}원</span>
                                                    </p>
                                                    <button
                                                        onClick={() => {
                                                            LinkClick(value, value.id)
                                                        }}>
                                                        자세히 보기
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })}
                        </div>
                    </div>
                    <div className={styles.OrderBox}>
                        <p className={styles.OrderTitle}>
                            결제완료<span>{list && getListLength(list.filter((v) => v.status === 'paid'))}개</span>
                        </p>
                        <div className={styles.ListWrap}>
                            {list &&
                                list
                                    .filter((v) => v.status === 'paid' && (filter.category[v.category].checked || filter.category['ALL'].checked))
                                    .map((value, index) => {
                                        return (
                                            <div className={styles.ListBox}>
                                                <div
                                                    style={{ backgroundColor: activeStyle(value.category) }}
                                                    className={styles.ListTitleBox}>
                                                    <p>{detailTitle(value.category)}</p> <span>{getModifyDate(value)}</span>
                                                </div>
                                                <div className={styles.ListContent}>
                                                    {/*<p>NAME : {value.name}</p>*/}
                                                    <p>PHONE : {value.phone}</p>
                                                    <p>
                                                        총 결제 금액 : <span>{numberWithCommas(getTotalPrice(value))}원</span>
                                                    </p>
                                                    <button
                                                        onClick={() => {
                                                            LinkClick(value, value.id)
                                                        }}>
                                                        자세히 보기
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })}
                        </div>
                    </div>
                    <div className={styles.OrderBox}>
                        <p className={styles.OrderTitle}>
                            작업중<span>{list && getListLength(list.filter((v) => v.status === 'wip'))}개</span>
                        </p>
                        <div className={styles.ListWrap}>
                            {list &&
                                list
                                    .filter((v) => v.status === 'wip' && (filter.category[v.category].checked || filter.category['ALL'].checked))
                                    .map((value, index) => {
                                        return (
                                            <div className={styles.ListBox}>
                                                <div
                                                    style={{ backgroundColor: activeStyle(value.category) }}
                                                    className={styles.ListTitleBox}>
                                                    <p>{detailTitle(value.category)}</p> <span>{getModifyDate(value)}</span>
                                                </div>
                                                <div className={styles.ListContent}>
                                                    {/*<p>NAME : {value.name}</p>*/}
                                                    <p>PHONE : {value.phone}</p>
                                                    <p>
                                                        총 결제 금액 : <span>{numberWithCommas(getTotalPrice(value))}원</span>
                                                    </p>
                                                    <button
                                                        onClick={() => {
                                                            LinkClick(value, value.id)
                                                        }}>
                                                        자세히 보기
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })}
                        </div>
                    </div>
                    <div className={styles.OrderBox}>
                        <p className={styles.OrderTitle}>
                            픽업대기<span>{list && getListLength(list.filter((v) => v.status === 'done'))}개</span>
                        </p>
                        <div className={styles.ListWrap}>
                            {list &&
                                list
                                    .filter((v) => v.status === 'done' && (filter.category[v.category].checked || filter.category['ALL'].checked))
                                    .map((value, index) => {
                                        return (
                                            <div className={styles.ListBox}>
                                                <div
                                                    style={{ backgroundColor: activeStyle(value.category) }}
                                                    className={styles.ListTitleBox}>
                                                    <p>{detailTitle(value.category)}</p> <span>{getModifyDate(value)}</span>
                                                </div>
                                                <div className={styles.ListContent}>
                                                    {/*<p>NAME : {value.name}</p>*/}
                                                    <p>PHONE : {value.phone}</p>
                                                    <p>
                                                        총 결제 금액 : <span>{numberWithCommas(getTotalPrice(value))}원</span>
                                                    </p>
                                                    <button
                                                        onClick={() => {
                                                            LinkClick(value, value.id)
                                                        }}>
                                                        자세히 보기
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })}
                        </div>
                    </div>
                    <div className={styles.OrderBox}>
                        <p className={styles.OrderTitle}>
                            픽업완료<span>{list && getListLength(list.filter((v) => v.status === 'taken'))}개</span>
                        </p>
                        <div className={styles.ListWrap}>
                            {list &&
                                list
                                    .filter((v) => v.status === 'taken' && (filter.category[v.category].checked || filter.category['ALL'].checked))
                                    .map((value, index) => {
                                        return (
                                            <div className={styles.ListBox}>
                                                <div
                                                    style={{ backgroundColor: activeStyle(value.category) }}
                                                    className={styles.ListTitleBox}>
                                                    <p>{detailTitle(value.category)}</p> <span>{getModifyDate(value)}</span>
                                                </div>
                                                <div className={styles.ListContent}>
                                                    {/*<p>NAME : {value.name}</p>*/}
                                                    <p>PHONE : {value.phone}</p>
                                                    <p>
                                                        총 결제 금액 : <span>{numberWithCommas(getTotalPrice(value))}원</span>
                                                    </p>
                                                    <button
                                                        onClick={() => {
                                                            LinkClick(value, value.id)
                                                        }}>
                                                        자세히 보기
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })}
                        </div>
                    </div>
                    <div className={styles.OrderBox}>
                        <p className={styles.OrderTitle}>
                            주문취소<span>{list && getListLength(list.filter((v) => v.status === 'cancel'))}개</span>
                        </p>
                        <div className={styles.ListWrap}>
                            {list &&
                                list
                                    .filter((v) => v.status === 'cancel' && (filter.category[v.category].checked || filter.category['ALL'].checked))
                                    .map((value, index) => {
                                        return (
                                            <div className={styles.ListBox}>
                                                <div
                                                    style={{ backgroundColor: activeStyle(value.category) }}
                                                    className={styles.ListTitleBox}>
                                                    <p>{detailTitle(value.category)}</p> <span>{getModifyDate(value)}</span>
                                                </div>
                                                <div className={styles.ListContent}>
                                                    {/*<p>NAME : {value.name}</p>*/}
                                                    <p>PHONE : {value.phone}</p>
                                                    <p>
                                                        총 결제 금액 : <span>{numberWithCommas(getTotalPrice(value))}원</span>
                                                    </p>
                                                    <button
                                                        onClick={() => {
                                                            LinkClick(value, value.id)
                                                        }}>
                                                        자세히 보기
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderListContent
