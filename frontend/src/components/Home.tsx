import React from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ImageSlider from './ImageSlider'
import { Category, Individual } from '../types/types'
import { CategoryAPI, GridProps } from '../interfaces/interfaces'

import { CATEGORY_RESPONSE } from '../data/Category'

const GridComponent: React.FC<GridProps> = ({ categories }) => {
    return (
        <div className="container-center">
            <div className="grid-box">
                {/* container-centerを2つならべて使ってるのは汚い気がする */}
                {categories.map((category, index) => (
                    <Link to={`/detail/${category.id}`} className="card square link" key={index}>
                        <div className="container-center">
                            <img src={category.image} style={{ width: '180px' }} alt={category.label_ja} />
                        </div>
                        <div className="container-center">
                            <p>{category.label_ja}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

const Home = () => {
    const [categories, setCategories] = useState<Category[]>([])
    const [recentIndividuals, setRecentIndividuals] = useState<Individual[]>([])

    useEffect(() => {
        const fetchData = () => {
            // const response = await axios(API_ENDPOINTS.CATEGORY)
            // const data: CategoryAPI = await response.data
            const data: CategoryAPI = CATEGORY_RESPONSE
            console.log(data)
            setCategories(data.top_images)
            setRecentIndividuals(data.latest_individuals)
        }

        fetchData()
    }, [])

    if (categories.length == 0) {
        return <div className="card">Loading...</div>
    }

    return (
        <div className="wrapper home">
            <div className="container-center explain-container">
                <h3 className="padding-top">みんなでつくる，あにモン図鑑</h3>
            </div>
            <Link to={'/loading'} className="link">
                <div className="card-green">ダミーを送信</div>
            </Link>
            <div className="toppage_midashi">
                <p>最近の投稿</p>
                <div className="line"> </div>
            </div>
            <ImageSlider individuals={recentIndividuals} />
            <div className="toppage_midashi">
                <p>あにモン図鑑</p>
                <div className="line"> </div>
            </div>
            <GridComponent categories={categories} />
        </div>
    )
}

export default Home
