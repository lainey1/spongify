from ..models import db, RestaurantImage, environment, SCHEMA
from sqlalchemy.sql import text

# Add demo restaurant images
def seed_restaurant_image():
    restaurant_images = [
        RestaurantImage(
            restaurant_id=1,
            user_id=1,
            url='https://example.com/image1.jpg',
            is_preview=True  # Optional if you added this field
        ),
        RestaurantImage(
            restaurant_id=1,
            user_id=2,
            url='https://example.com/image2.jpg',
            is_preview=False
        ),
        RestaurantImage(
            restaurant_id=2,
            user_id=1,
            url='https://example.com/image3.jpg',
            is_preview=False
        ),
        RestaurantImage(
            restaurant_id=2,
            user_id=3,
            url='https://example.com/image4.jpg',
            is_preview=True
        ),
        RestaurantImage(
            restaurant_id=3,
            user_id=2,
            url='https://example.com/image5.jpg',
            is_preview=False
        ),
    ]

    db.session.bulk_save_objects(restaurant_images)
    db.session.commit()


def undo_restaurant_image():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.restaurant_images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM restaurant_images"))

    db.session.commit()
