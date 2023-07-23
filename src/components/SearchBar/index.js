import styles from './style.module.scss'

// img
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import IconSelect from 'resources/icon/icon_select_arrow.svg'

function SearchBar({ filter, setFilter }) {
    function generateFilter(category) {
        if (category === 'ALL') {
            setFilter((e) => {
                let state = JSON.parse(JSON.stringify(e))
                state.category['ALL'].checked = !e.category['ALL'].checked
                state.category['QR'].checked = !e.category['ALL'].checked
                state.category['print'].checked = !e.category['ALL'].checked
                state.category['embroidery'].checked = !e.category['ALL'].checked
                state.category['laser'].checked = !e.category['ALL'].checked
                return { ...state }
            })
        } else
            setFilter((e) => {
                let state = JSON.parse(JSON.stringify(e))
                state.category[category].checked = !state.category[category].checked
                let isAllCheck = true
                for (let key in state.category) {
                    if (key !== 'ALL' && !state.category[key].checked) {
                        isAllCheck = false
                    }
                }
                state.category['ALL'].checked = isAllCheck
                return { ...state }
            })
    }

    function getOrderDate(date) {
        function zeroCheck(num) {
            return num < 10 ? '0' + num : num
        }

        return (
            date.getFullYear().toString() +
            '-' +
            zeroCheck(date.getMonth() + 1) +
            '-' +
            zeroCheck(date.getDate()) +
            ' ' +
            zeroCheck(date.getHours()) +
            ':' +
            zeroCheck(date.getMinutes()) +
            ':' +
            zeroCheck(date.getSeconds())
        )
    }

    function renderPicker() {
        return (
            <div className={styles.DateWrap}>
                <select>
                    <option value=''>{filter.start ? filter.start.split(' ')[0] : 'CALENDER'}</option>
                    <img
                        src={IconSelect}
                        alt=''
                    />
                </select>
            </div>
        )
    }

    return (
        <div className={styles.Container}>
            <div className={styles.CategoryWrap}>
                <div
                    className={styles.CategoryBox}
                    onClick={(e) => {
                        generateFilter('ALL')
                        e.preventDefault()
                    }}>
                    <input
                        type='checkbox'
                        name='checkbox'
                        id='chk1'
                        checked={filter.category['ALL'].checked}
                        onClick={(e) => {
                            e.stopPropagation()
                            generateFilter('ALL')
                        }}
                    />
                    <label htmlFor='chk1'>ALL</label>
                </div>
                <div
                    className={styles.CategoryBox}
                    onClick={(e) => {
                        generateFilter('QR')
                        e.preventDefault()
                    }}>
                    <input
                        type='checkbox'
                        name='checkbox'
                        id='chk2'
                        className={styles.Blue}
                        checked={filter.category['QR'].checked}
                        onClick={(e) => {
                            e.stopPropagation()
                            generateFilter('QR')
                        }}
                    />
                    <label htmlFor='chk2'>PHOTO SCAN PRINTING</label>
                </div>
                <div
                    className={styles.CategoryBox}
                    onClick={(e) => {
                        generateFilter('print')
                        e.preventDefault()
                    }}>
                    <input
                        type='checkbox'
                        name='checkbox'
                        id='chk3'
                        className={styles.Green}
                        checked={filter.category['print'].checked}
                        onClick={(e) => {
                            e.stopPropagation()
                            generateFilter('print')
                        }}
                    />
                    <label htmlFor='chk3'>NBY DIGITAL PRINTING</label>
                </div>
                <div
                    className={styles.CategoryBox}
                    onClick={(e) => {
                        generateFilter('embroidery')
                        e.preventDefault()
                    }}>
                    <input
                        type='checkbox'
                        name='checkbox'
                        id='chk4'
                        className={styles.Purple}
                        checked={filter.category['embroidery'].checked}
                        onClick={(e) => {
                            e.stopPropagation()
                            generateFilter('embroidery')
                        }}
                    />
                    <label htmlFor='chk4'>EMBROIDERY</label>
                </div>
                <div
                    className={styles.CategoryBox}
                    onClick={(e) => {
                        generateFilter('laser')
                        e.preventDefault()
                    }}>
                    <input
                        type='checkbox'
                        name='checkbox'
                        id='chk5'
                        className={styles.Red}
                        checked={filter.category['laser'].checked}
                        onClick={(e) => {
                            e.stopPropagation()
                            generateFilter('laser')
                        }}
                    />
                    <label htmlFor='chk5'>LASER GUN PRINTING</label>
                </div>
            </div>

            <div>
                <ReactDatePicker
                    onChange={(date) => {
                        setFilter((e) => {
                            e['start'] = getOrderDate(date)
                            let endDate = new Date(date)
                            endDate.setDate(endDate.getDate() + 1)
                            e['end'] = getOrderDate(endDate)
                            return { ...e }
                        })
                    }}
                    customInput={renderPicker()}
                />
            </div>

            <div
                className={styles.SearchWrap}
                onClick={() => {
                    setFilter({
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
                        dayAgo: '',
                    })
                }}>
                <p>CLEAR</p>
            </div>

            <div className={styles.SearchWrap}>
                <p>SEARCH</p>
                <input
                    type='text'
                    value={filter['keyword']}
                    onChange={(e) => {
                        setFilter((v) => {
                            v['keyword'] = e.target.value
                            return { ...v }
                        })
                    }}
                />
            </div>
        </div>
    )
}

export default SearchBar
