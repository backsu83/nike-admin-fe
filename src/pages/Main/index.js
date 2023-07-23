import { LineBox, Logo } from 'components'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './style.module.scss'

import API from 'api'

export default function MainPage() {
    const [id, setId] = useState('4dm1n')
    const [password, setPassword] = useState('figmarlion!0704')

    const navigate = useNavigate()

    const onChangeId = (e) => {
        setId(e.target.value)
    }

    const onChangePassword = (e) => {
        setPassword(e.target.value)
    }

    const onKeyDown = async (e) => {
        if (e.key === 'Enter') {
            // try {
            await API.postLogin(id, password).then((res) => {
                if (res.result) {
                    navigate('/order/list')
                } else {
                    alert('아이디 혹은 비밀번호가 잘못되었습니다.')
                }
            })
            //     console.log(loginAPI)

            //     if (loginAPI === true) navigate('/order/list')
            //     else alert('아이디 혹은 비밀번호가 잘못되었습니다.')
            // } catch {
            //     alert('WTF')
            // } finally {
            //     // navigate()
            // }
        }
    }

    return (
        <div className={styles.MainContainer}>
            <div className={styles.LogoWrap}>
                <Logo />
            </div>
            <div className={styles.LoginWrap}>
                <LineBox>
                    <div className={styles.InputRow}>
                        <p>ID</p>
                        <input
                            type='text'
                            onChange={onChangeId}
                            value={id}
                            onKeyDown={onKeyDown}
                        />
                    </div>
                    <div className={styles.InputRow}>
                        <p>PASS</p>
                        <input
                            type='text'
                            onChange={onChangePassword}
                            value={password}
                            onKeyDown={onKeyDown}
                        />
                    </div>
                </LineBox>
            </div>
        </div>
    )
}
