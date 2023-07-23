const BASE_URL = '/admin/'
// const BASE_URL = 'http://192.168.0.72:8080/admin/'
//http://fig.asuscomm.com:5001
const COMMON_HEADER = {
    'Content-Type': 'application/json',
    credentials: 'include',
    // 'credentials':'same-origin'
    // 'Accept': '*/*',
    // 'Access-Control-Allow-Credentials':true,
    // 'Access-Control-Allow-Origin': '*',
}

// if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
//     BASE_URL = "http://localhost:3000" + BASE_URL
// }

// 공통적으로 사용하는 경우, request 정의.
// 헤더는 반드시 ContentType 및 Allow-Cross-Origin Control 정의 해야함
const request = async (
    path = '',
    body = {},
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'no-cors',
        credentials: 'include',
    },
    method = 'GET'
) => {
    return (
        await fetch(BASE_URL + path, {
            method: method,
            headers: headers,
            body: method.toLowerCase() === 'get' ? null : JSON.stringify(body),
        })
    ).json()
}
const orderRequest = async (
    path = '',
    body = {},
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'no-cors',
        credentials: 'include',
    },
    method = 'GET'
) => {
    return await fetch(BASE_URL + path, {
        method: method,
        headers: headers,
        body: method.toLowerCase() === 'get' ? null : JSON.stringify(body),
    })
}

const getClientRequest = async (
    path,
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'no-cors',
        Credentials: 'include',
    },
    method = 'GET'
) => {
    return (
        await fetch('/' + path, {
            method: method,
            headers: headers,
        })
    ).json()
}

// 일반 GET, POST, PUT, DELETE 경우 request 사용하여 정의

// const getAssets = async () =>  { return await getClientRequest('asset') }
const updateProduct = async (body) => {
    return await request('product', body, COMMON_HEADER, 'PUT')
}
const deleteProduct = async (id) => {
    return await request('product', { id }, COMMON_HEADER, 'DELETE')
}
const insertProduct = async (body) => {
    return await request('product', body, COMMON_HEADER, 'POST')
}
const doLogin = async (id, pw) => {
    return await request('login', { id, pw }, COMMON_HEADER, 'POST')
}

const insertOption = async (body) => {
    return await request('option', body, COMMON_HEADER, 'POST')
}
const updateOption = async (body) => {
    return await request('option', body, COMMON_HEADER, 'PUT')
}
const deleteOption = async (body) => {
    return await request('option', body, COMMON_HEADER, 'DELETE')
}

// const postAligo = async (name,phone) => {
//     if (!name || !phone)
//         return;
//
//     //추후 삭제 필요
//     var win = window.open( "",  "", "toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,left=10000, top=10000, width=5, height=5, visible=none");
//     win.document.write(`<script> var name = ${name}; var phone=${phone}; </script>` +
//     "<script> window.location.href = encodeURI(`http://apis.aligo.in/send?key=3j5md0dzzts07d2li4yh0tqtwpo55c9m&user_id=figcoltd&sender=01021885441&receiver=01092073834&msg=NIKE DO IT YOURSELP\n<홍대점>\n${name}님 주문하신 커스텀이 완료되었습니다.\n직원에게 문의하여 상품을 픽업해 주세요.`); </script>");
//     setTimeout(function(){ win.close(); },250);
// }

// Form 경우 fetch 정의
const uploadImage = (formData) =>
    fetch('/upload', {
        method: 'POST',
        headers: {
            // content type = multipart를 넣지 않고 서버에서 해석 하도록 Content-type 정의 하지 않음
            'Access-Control-Allow-Origin': 'no-cors',
        },
        body: formData,
    })

const uploadOrder = async (body) => {
    return await request(
        'order',
        body,
        {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'no-cors',
        },
        'POST'
    )
}

const getOrders = (url) => request(url)
const postLogin = (id, pw) => {
    if (!id || !pw) throw new Error('Login 입력 누락')
    return request('login', { id, pw }, COMMON_HEADER, 'POST')
}

// Form 경우 fetch 정의
const postFormData = async (formData) => {
    return (
        await fetch(BASE_URL + 'upload', {
            method: 'POST',
            headers: {
                // content type = multipart를 넣지 않고 서버에서 해석 하도록 Content-type 정의 하지 않음
                'Access-Control-Allow-Origin': 'no-cors',
            },
            body: formData,
        })
    ).json()
}

const putOrder = (id, is_agreed, assets, category, option_id, img, img_back, status) => {
    if (!id || !is_agreed || !category || !status) {
        throw new Error('order 정보 누락')
    }

    let order = {
        id,
        is_agreed,
        assets,
        category,
        img,
        img_back,
        status,
    }

    if (option_id) {
        order.option_id = option_id
    }

    return request(
        'order',
        {
            order,
        },
        COMMON_HEADER,
        'PUT'
    )
}

// 일반 GET, POST, PUT, DELETE 경우 request 사용 하여 정의
const getProducts = () => getClientRequest('product')
const postProduct = (thumnbnail, price, name, code, category, img, img_back, custom_id, masking_x, masking_y, masking_width, masking_height) => {
    if (!thumnbnail || !price || !name || !code || !category) throw new Error('product 입력 누락')

    return request(
        'product',
        {
            thumnbnail,
            price,
            name,
            code,
            category,
            img,
            img_back,
            custom_id,
            masking_x,
            masking_y,
            masking_width,
            masking_height,
        },
        {},
        'POST'
    )
}

const putProduct = (id, thumnbnail, price, name, code, category, img, img_back, custom_id, masking_x, masking_y, masking_width, masking_height) => {
    if (!id || !thumnbnail || !price || !name || !code || !category) throw new Error('product 입력 누락')

    return request(
        'product',
        {
            thumnbnail,
            price,
            name,
            code,
            category,
            img,
            img_back,
            custom_id,
            masking_x,
            masking_y,
            masking_width,
            masking_height,
        },
        {},
        'POST'
    )
}

const getOptions = () => request('option')
const postOption = (size, price, color, img, img_back, product_id, assets) => {
    if (!size || !color || !product_id) throw new Error('option 입력 누락')

    return request(
        'option',
        {
            option: { size, price, color, img, img_back, product_id, assets },
        },
        COMMON_HEADER,
        'POST'
    )
}

const putOption = (id, size, price, color, img, img_back, product_id, assets) => {
    if (!id || !size || !color || !product_id) throw new Error('option 입력 누락')

    return request(
        'option',
        {
            option: { id, size, price, color, img, img_back, product_id, assets },
        },
        COMMON_HEADER,
        'PUT'
    )
}

const putOptionAsset = (id, size, color, price, product_id, assets) => {
    if (!id || !size || !color || !product_id || !assets) throw new Error('option 입력 누락')

    return request(
        'option',
        {
            option: { id, size, color, price, product_id, assets },
        },
        COMMON_HEADER,
        'PUT'
    )
}

// const deleteOption = (id) => {
//     if (!id)
//         throw new Error("option delete 입력 오류")
//     return request('option')
// }

const getAssets = () => getClientRequest('asset')
const postAsset = (category, price, img, custom_id) => {
    if (!category || !img) throw new Error('option 입력 누락')

    return request(
        'asset',
        {
            asset: { category, price, img },
        },
        COMMON_HEADER,
        'POST'
    )
}
const putAsset = (id, category, price, img, custom_id) => {
    if (!id || !category || !img) throw new Error('option 입력 누락')

    return request(
        'asset',
        {
            asset: { id, category, price, img, custom_id: '' },
        },
        COMMON_HEADER,
        'PUT'
    )
}

const deleteAsset = (id) => {
    if (!id) throw new Error('option delete 입력 오류')
    return request('asset', { id }, COMMON_HEADER, 'DELETE')
}

const postMessage = (id, msg, img) => {
    if (!id) {
        throw new Error('order 정보 누락')
    }

    let order = {
        id,
        msg,
        path: img,
        msg_type: img ? 'MMS' : '',
    }

    return request('message', { order }, COMMON_HEADER, 'POST')
}

const API = {
    uploadImage,
    insertProduct,
    updateProduct,

    postFormData,
    postLogin,

    getOrders,
    putOrder,

    getProducts,
    postProduct,
    putProduct,
    deleteProduct,

    getOptions,
    postOption,
    putOption,
    deleteOption,

    getAssets,
    postAsset,
    putAsset,
    deleteAsset,

    putOptionAsset,
    postMessage,
    // postAligo
}

export {
    uploadImage,
    getProducts,
    uploadOrder,
    doLogin,
    getOrders,
    putOrder,
    insertOption,
    updateOption,
    deleteOption,
    getAssets,
    postAsset,
    putAsset,
    deleteAsset,
    insertProduct,
    updateProduct,
    deleteProduct,
    getOptions,
    putOptionAsset,
    postMessage,
    // postAligo
}

export default API
