import React from 'react'
import { GridProps } from '../interfaces/interfaces'
import { Link } from 'react-router-dom'

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

export default GridComponent
