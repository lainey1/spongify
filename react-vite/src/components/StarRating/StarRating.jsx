import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";
import "./StarRating.css";

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<IoIosStar key={i} className="star filled" />);
    } else if (rating >= i - 0.5) {
      stars.push(<IoIosStarHalf key={i} className="star half-filled" />);
    } else {
      stars.push(<IoIosStarOutline key={i} className="star empty" />);
    }
  }
  return <div className="star-rating">{stars}</div>;
};

export default StarRating;
