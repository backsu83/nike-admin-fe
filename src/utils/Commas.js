//숫자 3자리수 콤마 코드
export const numberWithCommas = (x) => {
    return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const getQuery = () => {
    let query_string = window.location.search
    query_string = query_string.replace('?', '')
    const query_string_arr = query_string.split('&')
    const query = {}
    for (let i = 0; i < query_string_arr.length; i++) {
        const key_value_str = query_string_arr[i]
        const key_value_arr = key_value_str.split('=')
        if (key_value_arr.length === 2) {
            query[key_value_arr[0]] = key_value_arr[1] ? key_value_arr[1] : ''
        } else if (key_value_arr.length > 2) {
            query[key_value_arr[0]] = key_value_arr[1] ? key_value_arr.slice(1).join('=') : ''
        }
    }

    return query
}
