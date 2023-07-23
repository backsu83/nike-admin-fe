import styles from './style.module.scss'

import Pages from 'pages'
// img
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ColorBar from 'resources/icon/icon_color_bar.svg'
import MainLogo from 'resources/icon/main_logo.svg'
import MainImage from 'resources/icon/main_start_bg.svg'
// const SERVER_URL = 'http://192.168.0.72:8080/'
const SERVER_URL = 'http://13.124.134.96/'
function PhotoScan() {
    const { custom_id } = useParams()
    const id = window.location.hash.split('?')[1]
    const navigate = useNavigate()
    const inputRef = useRef(null)

    const [file, setFile] = useState(null)
    const [thumbNail, setThumbnail] = useState('')

    const onUploadImage = useCallback((e) => {
        let reader = new FileReader()

        reader.onloadend = () => {
            // 2. 읽기가 완료되면 아래코드가 실행됩니다.
            const base64 = reader.result
            if (base64) {
                setThumbnail(base64.toString()) // 파일 base64 상태 업데이트
            }
        }
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]) // 1. 파일을 읽어 버퍼에 저장합니다.
            setFile(e.target.files[0]) // 파일 상태 업데이트
        }
    }, [])

    const onUploadImageButtonClick = useCallback(() => {
        if (!inputRef.current) {
            return
        }
        inputRef.current.click()
    }, [])

    const checkValid = async () => {
        // const id = new URL((window || document).location.href).searchParams.get('custom_id')
        if (!id) {
            alert('유효한 접근이 아닙니다.')
            // (window||document).close()
            // window.close('','_parent','')
            window.open('', '_self').close()
            // return
        }
        try {
            const { asset_list } = await (await fetch(`${SERVER_URL}asset?${id}`)).json()
            if (asset_list.length <= 0) alert('올바른 id가 아닙니다')
            // else {
            //     const fileInput = document.createElement('input')
            //     document.body.appendChild(fileInput)
            //     fileInput.id = 'asset'
            //     fileInput.addEventListener('change', uploadPhoto)
            //     fileInput.type = 'file'
            //     fileInput.accept = 'image/*'
            //     document.getElementById('asset').click()
            // }
        } catch {
            alert('네트워크 이상으로 실패했습니다.')
        } finally {
        }
    }

    const uploadPhoto = async () => {
        const formData = new FormData()
        formData.append('images', file)
        try {
            const { img } = await (
                await fetch(`${SERVER_URL}upload`, {
                    method: 'POST',
                    headers: {
                        'Access-Control-Allow-Origin': 'no-cors',
                    },
                    body: formData,
                })
            ).json()

            const result = await (
                await fetch(`${SERVER_URL}asset`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'no-cors',
                    },
                    body: JSON.stringify({
                        asset: {
                            category: 'qr',
                            price: 0,
                            img,
                            name: 'QR upload',
                            img_back: null,
                            custom_id: id.split('=')[1],
                        },
                    }),
                })
            ).json()

            if (result) alert('성공했습니다')
            else alert('실패했습니다')
        } catch {
            alert('네트워크 이상으로 업로드에 실패했습니다. 다시 시도해주세요.')
        }
    }

    useEffect(() => {
        const parent = document.getElementById('root')

        parent.innerHTML = ''

        checkValid()
    }, [])
    return (
        <>
            <div className={styles.MainContainer}>
                <div className={styles.MainWrap}>
                    <div className={styles.MainSection}>
                        <img
                            src={ColorBar}
                            alt='ColorBar'
                            className={styles.ColorBar}
                        />
                        <img
                            src={MainLogo}
                            alt='logo'
                            className={styles.Logo}
                        />
                        <div className={styles.LayoutContainer}>
                            <i></i>
                            <i></i>
                            <i></i>
                            <i></i>
                            <p className={styles.BorderText}>PHOTO SCAN PRINTING</p>
                        </div>
                        {/* id && 추가할것 */}
                        {!file && (
                            <div className={styles.StartSection}>
                                <img
                                    src={MainImage}
                                    alt=''
                                />
                                <input
                                    hidden
                                    ref={inputRef}
                                    onChange={onUploadImage}
                                    type='file'
                                    id='file'
                                    accept='image/*'
                                />
                                <button onClick={onUploadImageButtonClick}>사진 불러오기</button>
                            </div>
                        )}
                        {file && (
                            <>
                                <div className={styles.ImgBox}>
                                    <div className={styles.ImgInner}>
                                        <img src={thumbNail} />
                                        <i></i>
                                        <i></i>
                                        <i></i>
                                        <i></i>
                                        <i></i>
                                    </div>
                                </div>
                                <div className={styles.BtnBox}>
                                    <button
                                        className={styles.ActiveSelectButton}
                                        onClick={uploadPhoto}>
                                        보내기
                                    </button>
                                    <button className={styles.ActiveSelectButton}>뒤로가기</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {false && <Pages.PhotoSend file={file} />}
        </>
    )
}

export default PhotoScan
