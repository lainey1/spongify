import logo from "../../../../app/static/images/eaterverse-logo-transparent.png";
import "./About.css";

const About = () => {
  return (
    <div className="about-us-container">
      <div className="about-us-image">
        <img src={logo} alt="EaterVerse" />
      </div>
      <div className="about-us-content">
        <h1>About Eaterverse</h1>
        <p>
          Welcome to EaterVerse, your ultimate destination for discovering and
          connecting with restaurants that satisfy every craving! Our mission is
          to revolutionize how people explore dining experiences by combining
          the convenience of online reservations with authentic reviews and
          insights. Whether you’re planning a date night, a family dinner, or a
          quick bite, EaterVerse is here to guide you through a galaxy of
          flavors.
        </p>
        <p>
          At EaterVerse, we believe that dining is more than just eating—it’s
          about the memories you create, the people you share them with, and the
          stories behind every dish. Our platform brings together food
          enthusiasts, restaurant owners, and local communities to celebrate the
          joy of great food.
        </p>
        <p>
          Join us as we navigate the universe of dining possibilities, one plate
          at a time!
        </p>
      </div>
    </div>
  );
};

export default About;
