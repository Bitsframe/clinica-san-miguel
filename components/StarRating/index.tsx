'use client'
import { FC } from 'react';
import StarRatings from "react-star-ratings";


interface StarRatingProps {
    rating: number;
    starRatedColor?: string;
    numberOfStars?: number;
    changeRating?: (newRating: number, name: string) => void;
    name?: string;
    starDimension?: string;
    starSpacing?: string;
}

const StarRating: FC<StarRatingProps> = ({
    rating,
    starRatedColor = '#ffa500',
    numberOfStars = 5,
    changeRating,
    name = 'rating',
    starDimension = '20px',
    starSpacing = '5px',
}) => {
    return (
        <StarRatings
            rating={rating}
            starRatedColor={starRatedColor}
            changeRating={changeRating}
            numberOfStars={numberOfStars}
            name={name}
            starDimension={starDimension}
            starSpacing={starSpacing}
        />
    );
};

export default StarRating;
