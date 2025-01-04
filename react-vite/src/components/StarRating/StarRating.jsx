import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";
import "./StarRating.css";

const StarRating = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const starValue = i + 1;
    if (rating >= starValue) {
      return <IoIosStar key={starValue} className="star filled" />;
    } else if (rating >= starValue - 0.5) {
      return <IoIosStarHalf key={starValue} className="star half-filled" />;
    } else {
      return <IoIosStarOutline key={starValue} className="star empty" />;
    }
  });

  return <div className="star-rating">{stars}</div>;
};

export default StarRating;
