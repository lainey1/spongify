import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { thunkUpdateProfile } from "../../redux/session";
import './EditProfile.css';

function EditProfile () {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { userId } = useParams()

    const currentUser = useSelector((state) => state.session.currentUser);

    const [formData, setFormData] = useState({
        location: '',
        favorite_cuisine: '',
        headline: '', 

    });

    
    const [hasSubmitted, setHasSubmitted] = useState(false);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };



    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setHasSubmitted(true);


    //     try {
    //         const updatedProfile = {
    //             location: formData.location,
    //             favorite_cuisine: formData.favorite_cuisine,
    //             headline: formData.headline,
    //         };

    //         console.log('DEBUG THUNK')
    //         const res = await dispatch(thunkUpdateProfile(userId, updatedProfile));    

    //         console.log("RES====",res)

    //         navigate(`/user/${userId}`)

    //         if (!res.ok) {
    //             const updateErrors = await res.json();
    //             // console.log(updateErrors)
    //             return setErrors(updateErrors);
    //         }

    //     } 
    //     catch (res) {

    //         const data = await res.json();
    //         if (data && data.errors) {
    //             setErrors(data.errors);
    //         }
    //     }
    // };
    


    const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    const updatedProfile = {
        location: formData.location,
        favorite_cuisine: formData.favorite_cuisine,
        headline: formData.headline,
    };

    console.log('DEBUG THUNK');
    const res = await dispatch(thunkUpdateProfile(userId, updatedProfile));  

    console.log("RES====", res);

    navigate(`/user/${userId}`);
};


    useEffect(() => {

        if (currentUser) {
            setFormData({
                location: currentUser.location || '',
                favorite_cuisine: currentUser.favorite_cuisine || '',
                headline: currentUser.headline || '',

            });
        }
    }, [currentUser]);



    return (
         <div className="update-profile-container">
            <h2>Update your Profile</h2>

            <form className="update-profile-form" onSubmit={handleSubmit}>
               
                    <div>Location</div>
                    <input 
                        id="location"
                        placeholder="location"
                        type="text"
                        value={formData.location}
                        onChange={handleChange}
                    />
                    {hasSubmitted}

                    <div>Favorite Cuisine</div>
                    <input 
                        id="favorite_cuisine"
                        placeholder="Favorite Cuisine"
                        type="text"
                        value={formData.favorite_cuisine}
                        onChange={handleChange}
                    />
                    {hasSubmitted}

               
                    <hr></hr>

                    <div className="update-headline-container">
                        <h3>Describe your place to guests</h3>
                        <p>
                            Write a sentence or two about yourself.
                        </p>
                    

                    <textarea 
                        className="form-textarea"
                        placeholder="Describe your food habits."
                        id="headline"
                        value={formData.headline}
                        onChange={handleChange}
                    />
                    {hasSubmitted}
                    </div>


                <hr></hr>
   

                <hr></hr>

                <button 
                    className="submit-button"
                    type="submit"
                >
                    Update your Profile
                </button>
            </form>

        </div>
    )
}

export default EditProfile;