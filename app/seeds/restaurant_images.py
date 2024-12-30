from ..models import db, RestaurantImage, environment, SCHEMA
from sqlalchemy.sql import text

#Add demo restaurant images
def seed_restaurant_image():
    restaurant_image = RestaurantImage(
        restaurant_id = 2,
        user_id = 1,
        url = 'image.url',
    )

    db.session.add(restaurant_image)
    db.session.commit()


def undo_restaurant_image():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.restaurant_images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM restaurant_image"))

    db.session.commit()
