from datetime import datetime

# from app.models import db, Reservation, environment, SCHEMA
# from sqlalchemy.sql import text


# # Adds a demo user, you can add other users here if you want
# def seed_reservations():
#     res1 = Reservation(
#             restaurant_id = 1,
#             user_id = 1,
#             date = '2025-01-01 10:30:00',
#             party_size = 3
#         )
#     res2 = Reservation(
#             restaurant_id = 2,
#             user_id = 2,
#             date = '2025-02-11 13:45:00',
#             party_size = 3
#         )
#     res3 = Reservation(
#             restaurant_id = 3,
#             user_id = 3,
#             date = '2025-11-22 06:30:00',
#             party_size = 3
#         )
#     res4 = Reservation(
#             restaurant_id = 4,
#             user_id = 4,
#             date = '2025-03-11 08:00:00',
#             party_size = 3
#         )

#     db.session.add(res1)
#     db.session.add(res2)
#     db.session.add(res3)
#     db.session.add(res4)
#     db.session.commit()


# # Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# # have a built in function to do this. With postgres in production TRUNCATE
# # removes all the data from the table, and RESET IDENTITY resets the auto
# # incrementing primary key, CASCADE deletes any dependent entities.  With
# # sqlite3 in development you need to instead use DELETE to remove all data and
# # it will reset the primary keys for you as well.
# def undo_reservations():
#     if environment == "production":
#         db.session.execute(f"TRUNCATE table {SCHEMA}.reservations RESTART IDENTITY CASCADE;")
#     else:
#         db.session.execute(text("DELETE FROM reservations"))

#     db.session.commit()


from app.models import db, Reservation, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_reservations():
    res1 = Reservation(
           id = 1,
           restaurant_id = 4,
           user_id = 3,
           date=datetime.strptime('2024-12-20 13:45:00', '%Y-%m-%d %H:%M:%S'),
           party_size = 4,
        )

    db.session.add(res1)
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
