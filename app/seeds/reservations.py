from datetime import datetime
from app.models import db, Reservation, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_reservations():
    res1 = Reservation(
           id = 1,
           restaurant_id = 3,
           user_id = 1,
           date=datetime.strptime('2024-12-20T13:45', '%Y-%m-%dT%H:%M'),
           party_size = 4,
        )

    res2 = Reservation(
        id=2,
        restaurant_id=2,
        user_id=3,
        date=datetime.strptime('2024-12-21T18:00', '%Y-%m-%dT%H:%M'),
        party_size=2,
    )

    res3 = Reservation(
        id=3,
        restaurant_id=1,
        user_id=2,
        date=datetime.strptime('2024-12-22T19:30', '%Y-%m-%dT%H:%M'),
        party_size=6,
    )

    db.session.add(res1)
    db.session.add(res2)
    db.session.add(res3)
    db.session.commit()



# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_reservations():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.reservations RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reservations"))
    db.session.commit()
