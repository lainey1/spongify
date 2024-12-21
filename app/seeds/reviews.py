from app.models import db, Review, environment, SCHEMA
from sqlalchemy.sql import text

# Adds demo reviews
def seed_reviews():
    review1 = Review(
        user_id=1,
        restaurant_id=1,
        review='Great food and service. Will definitely be back!',
        stars=5
    )
    review2 = Review(
        user_id=2,
        restaurant_id=1,
        review='The burgers were good but the fries were cold.',
        stars=3
    )
    review3 = Review(
        user_id=3,
        restaurant_id=1,
        review='The milkshakes were delicious!',
        stars=4
    )
    review4 = Review(
        user_id=1,
        restaurant_id=2,
        review='The escargot was amazing!',
        stars=5
    )
    review5 = Review(
        user_id=2,
        restaurant_id=2,
        review='The service was terrible.',
        stars=1
    )
    review6 = Review(
        user_id=3,
        restaurant_id=2,
        review='The food was good but overpriced.',
        stars=3
    )
    review7 = Review(
        user_id=1,
        restaurant_id=3,
        review='The pasta was delicious!',
        stars=4
    )

    db.session.add(review1)
    db.session.add(review2)
    db.session.add(review3)
    db.session.add(review4)
    db.session.add(review5)
    db.session.add(review6)
    db.session.add(review7)
    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the restaurants table.
# SQLAlchemy doesn't have a built-in function to do this.
# With Postgres in production, TRUNCATE removes all the data from the table,
# and RESET IDENTITY resets the auto-incrementing primary key, CASCADE deletes
# any dependent entities. With SQLite in development, use DELETE to remove
# all data and it will reset the primary keys for you as well.
def undo_reviews():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}, reviews RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reviews"))

    db.session.commit()