from ..models import db, ReviewImage, environment, SCHEMA
from sqlalchemy.sql import text

#Add demo review images
def seed_review_image():
    review_image1 = ReviewImage(
        review_id = 1,
        user_id = 1,
        url = 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600',
        is_preview=True,
    )
    review_image2 = ReviewImage(
        review_id = 1,
        user_id = 1,
        url = 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600',
        is_preview=False,
    )
    review_image3 = ReviewImage(
        review_id = 2,
        user_id = 2,
        url = 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600',
        is_preview=True,
    )
    review_image4 = ReviewImage(
        review_id = 3,
        user_id = 3,
        url = 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600',
        is_preview=True,
    )

    db.session.add(review_image1)
    db.session.add(review_image2)
    db.session.add(review_image3)
    db.session.add(review_image4)
    db.session.commit()


def undo_review_image():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.review_images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM review_image"))

    db.session.commit()
