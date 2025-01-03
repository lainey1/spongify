import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<IoIosStar key={i} style={{ color: "#FFD700" }} />);
    } else if (rating >= i - 0.5) {
      stars.push(<IoIosStarHalf key={i} style={{ color: "#FFD700" }} />);
    } else {
      stars.push(<IoIosStarOutline key={i} style={{ color: "#D3D3D3" }} />);
    }
  }
  return <div style={{ display: "flex", gap: "0.2em" }}>{stars}</div>;
};

export default StarRating;
