import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ImageAPI, TriviaAPI } from '../interfaces/interfaces'
import { Trivia } from '../types/types'
import TriviaSlider from './TriviaSlider'
import { TRIVIA_RESPONSE } from '../data/Trivia'

const Loading = () => {
    const navigate = useNavigate()
    const [dots, setDots] = useState(0)

    const [responseStatus, setResponseStatus] = useState(true)

    const [triviaList, setTriviaList] = useState<Trivia[]>([])

    // トリビアの取得
    useEffect(() => {
        const fetchData = () => {
            try {
                // const response = await axios(API_ENDPOINTS.TRIVIA)
                // const data: TriviaAPI = response.data
                const data: TriviaAPI = TRIVIA_RESPONSE
                console.log(`data: ${data}`)
                setTriviaList(data.trivia)
            } catch (error) {
                console.error('Failed to fetch trivia:', error)
                setResponseStatus(false)
            }
        }

        fetchData()

        const timer = setInterval(() => {
            setDots((prevDots) => (prevDots + 1) % 4)
        }, 500)

        return () => {
            clearInterval(timer)
        }
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            const data: ImageAPI = {
                category: {
                    id: 20,
                    label: 'tabby',
                    label_ja: 'タビー猫',
                    hp: 50,
                    attack: 50,
                    defense: 50,
                    speed: 90,
                    magic_attack: 50,
                    magic_defense: 50,
                    type: 'ノーマル',
                    trivia: 'タビー猫の柄の種類は多岐にわたり、独特の模様を持っています。また、猫は寝転がっているところが好きで、目の前にあるものに関係なく、その場で寝てしまうことがあります。',
                    ecology: 'タビー猫は主に人間の家で飼われています。小型哺乳類や鳥類を食べ、夜行性です。'
                },
                individual: {
                    id: 45,
                    image: '/images/devtanuki.png',
                    score: 44,
                    category: 20,
                    label: 'tabby',
                    label_ja: 'タビー猫'
                }
            }
            navigate('/result', { state: { data } })
        }, 15000)

        return () => {
            clearTimeout(timer) // コンポーネントがアンマウントされたらタイマーをクリアします
        }
    }, [navigate])

    useEffect(() => {
        console.log(triviaList)
    }, [triviaList])

    if (triviaList.length < 1) {
        return <h1 className="card">Loading...</h1>
    }

    if (!responseStatus) {
        return (
            <div>
                <div className="text-center padding-top">画像処理に失敗しました</div>
                <Link className="link" to={'/'}>
                    <div className="card-green">Home</div>
                </Link>
            </div>
        )
    }

    return (
        <div>
            <p style={{ fontSize: '30px', textAlign: 'center' }}>Loading{'.'.repeat(dots)}</p>
            <TriviaSlider trivias={triviaList} />
        </div>
    )
}

export default Loading
