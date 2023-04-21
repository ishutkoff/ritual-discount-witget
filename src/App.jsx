import { useEffect, useState } from 'react'
import axios from 'axios'
import InputMask from 'react-input-mask'
import { ReactComponent as ArrowIcon } from './assets/arrow.svg'

import './App.scss'

function App() {
	const [discounts, setDiscounts] = useState([])
	const [currentSlide, setCurrentSlide] = useState({})
	const [prevSlide, setPrevSlide] = useState({})
	const [nextSlide, setNextSlide] = useState({})
	const [currentIndex, setCurrentIndex] = useState(1)
	const [phone, setPhone] = useState('')
	const [coupon, setCoupon] = useState('')

	const alphabet = 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z'

	useEffect(() => {
		async function fetchData() {
			const res = await axios.get(
				`${import.meta.env.VITE_URL}/shops/discount/${localStorage.shopId}`
			)
			// console.log()

			setDiscounts(res.data.discounts)
			setCurrentSlide(res.data.discounts[1])
			setPrevSlide(res.data.discounts[0])
			setNextSlide(res.data.discounts[2])
		}
		fetchData()
		if (localStorage.coupon) {
			setCoupon(localStorage.coupon)
		}
	}, [])

	// const generateCoupon = () => {
	// 	if (!localStorage.coupon) {
	// 		let couponFirst = ''
	// 		let lastFirst = ''
	// 		const alphabetArray = alphabet.split(' ')
	// 		function getRandomInt(max) {
	// 			return Math.floor(Math.random() * max)
	// 		}

	// 		for (let i = 0; i <= 3; i++) {
	// 			couponFirst += alphabetArray[getRandomInt(alphabetArray.length)]
	// 			lastFirst += alphabetArray[getRandomInt(alphabetArray.length)]
	// 		}

	// 		localStorage.coupon = `${lastFirst}-${lastFirst}`
	// 		setCoupon(`${lastFirst}-${lastFirst}`)
	// 	}
	// }

	const generateCoupon = () => {
		if (!localStorage.coupon) {
			localStorage.coupon = `ПАМЯТЬ-БЛИЗКИХ`
			setCoupon(`ПАМЯТЬ-БЛИЗКИХ`)
		}
	}

	const phoneHandler = e => {
		setPhone(e.target.value)
	}

	const setSliderHandler = slide => {
		if (coupon) return
		setCurrentIndex(discounts.indexOf(slide))
	}

	const sendData = async () => {
		generateCoupon()
		const res = await axios.post(
			`${import.meta.env.VITE_URL}/send-data/discount/`,
			{
				shopId: localStorage.shopId,
				phone: phone,
				discountTarget: currentSlide.title,
				discount: currentSlide.discount,
				coupon: localStorage.coupon,
			},
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		)
		await res.data
	}

	const setSliderGroup = () => {
		if (currentIndex === 0) {
			setPrevSlide(discounts[discounts.length - 1])
		} else {
			setPrevSlide(discounts[currentIndex - 1])
		}
		if (currentIndex === discounts.length - 1) {
			setNextSlide(discounts[0])
		} else {
			setNextSlide(discounts[currentIndex + 1])
		}

		setCurrentSlide(discounts[currentIndex])
	}

	useEffect(() => {
		if (discounts.length > 0) setSliderGroup()
	}, [currentIndex])

	const incIndex = () => {
		if (currentIndex >= discounts.length - 1) {
			setCurrentIndex(0)
		} else {
			setCurrentIndex(currentIndex + 1)
		}
	}

	const decIndex = () => {
		// let prev =
		if (currentIndex <= 0) {
			setCurrentIndex(discounts.length - 1)
		} else {
			setCurrentIndex(currentIndex - 1)
		}
	}

	return (
		<div
			className='discount-slider'
			style={{ background: localStorage.accentColor }}
		>
			<div className='discount-slider__left'>
				<div className='discount-slider__wrapper'>
					<div
						className='discount-slider__item'
						onClick={() => setSliderHandler(prevSlide)}
						style={{
							backgroundImage: `url("${import.meta.env.VITE_URL}/files/${
								prevSlide.image
							}")`,
						}}
					>
						<div className='discount-slider__item-title'>{prevSlide.title}</div>
						<div className='discount-slider__item-discount'>
							{prevSlide.discount}%
						</div>
					</div>
					<div
						className='discount-slider__item'
						style={{
							backgroundImage: `url("${import.meta.env.VITE_URL}/files/${
								currentSlide.image
							}")`,
						}}
					>
						<div className='discount-slider__item-title'>
							{currentSlide.title}
						</div>
						<div className='discount-slider__item-discount'>
							{currentSlide.discount}%
						</div>
					</div>
					<div
						className='discount-slider__item'
						onClick={() => setSliderHandler(nextSlide)}
						style={{
							backgroundImage: `url("${import.meta.env.VITE_URL}/files/${
								nextSlide.image
							}")`,
						}}
					>
						<div className='discount-slider__item-title'>{nextSlide.title}</div>
						<div className='discount-slider__item-discount'>
							{nextSlide.discount}%
						</div>
					</div>
				</div>
				<div className='discount-slider__buttons'>
					<button
						disabled={coupon}
						onClick={() => incIndex()}
						className='discount-slider__button discount-slider__button--top'
					>
						<ArrowIcon />
					</button>
					<button
						disabled={coupon}
						onClick={() => decIndex()}
						className='discount-slider__button discount-slider__button--bottom'
					>
						<ArrowIcon />
					</button>
				</div>
			</div>
			<div className='discount-slider__right'>
				<div className='discount-slider__right-wrapper'>
					{!coupon && (
						<>
							<p>
								Мы скорбим вместе с вами и предлагаем использовать один из
								вариантов нашей поддержки
							</p>
							<div className='discount-slider__form'>
								<span>Введите свой номер для получения скидки</span>
								<InputMask
									onChange={phoneHandler}
									value={phone}
									// value={phone}
									placeholder='Номер телефона'
									mask='+7(999) 999 99 99'
									maskChar=' '
								>
									{() => <input type='tel' placeholder='+7(___) ___ __ __' />}
								</InputMask>
								<button
									onClick={() => sendData()}
									disabled={phone.trim().length < 17}
								>
									Получить скидку
								</button>
							</div>
						</>
					)}

					{coupon && (
						<>
							<h2 className='discount-slider__form-title'>
								Скидка {currentSlide.discount}% на&nbsp;
								<span>{currentSlide.title}</span>
							</h2>
							<div className='discount-slider__coupon'>
								<div className='discount-slider__coupon-wrapper'>
									<span className='discount-slider__coupon-label'>
										Ваш купон
									</span>
									<span className='discount-slider__coupon-value'>
										{localStorage.coupon}
									</span>
								</div>
							</div>
							<p className='discount-slider__success'>
								Наш квалифицированный агент&nbsp;свяжется&nbsp;с&nbsp;Вами
							</p>
						</>
					)}
				</div>
			</div>
		</div>
	)
}

export default App
