from ..models import db, RestaurantImage, environment, SCHEMA
from sqlalchemy.sql import text

# Add demo restaurant images
def seed_restaurant_image():
    restaurant_images = [
        RestaurantImage(
            restaurant_id=1,
            user_id=1,
            url='https://assets.epicurious.com/photos/5c745a108918ee7ab68daf79/1:1/w_2240,c_limit/Smashburger-recipe-120219.jpg',
            is_preview=False
        ),
        RestaurantImage(
            restaurant_id=1,
            user_id=2,
            url='https://www.tastingtable.com/img/gallery/what-makes-restaurant-burgers-taste-different-from-homemade-burgers-upgrade/intro-1662064407.jpg',
            is_preview=True
        ),
        RestaurantImage(
            restaurant_id=2,
            user_id=1,
            url='https://gobargingwp-s3.s3.eu-west-1.amazonaws.com/wp-content/uploads/2023/02/coq-au-vin.jpg',
            is_preview=True
        ),
        RestaurantImage(
            restaurant_id=3,
            user_id=3,
            url='https://static.stacker.com/s3fs-public/styles/sar_screen_maximum_large/s3/croppedshutterstock1829686103J2Y4jpg_249.JPEG',
            is_preview=True
        ),
        RestaurantImage(
            restaurant_id=4,
            user_id=2,
            url='https://sanfran.com/get/files/image/galleries/best-sushi-sf-2022.jpg',
            is_preview=True
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
