from app.models import db, UserProfile, environment, SCHEMA
from sqlalchemy.sql import text

# Adds demo profiles
def seed_profiles():
    profile1 = UserProfile(
        user_id=1,
        location='San Francisco, CA',
        cuisine='Italian',
        headline='Lover of authentic Italian cuisine and cozy dining experiences.',
    )
    profile2 = UserProfile(
        user_id=2,
        location='New York, NY',
        cuisine='Japanese',
        headline='Sushi fanatic exploring hidden gems in the city.',
    )
    profile3 = UserProfile(
        user_id=3,
        location='Austin, TX',
        cuisine='BBQ',
        headline='BBQ enthusiast with a penchant for smoky flavors.',
    )

    db.session.add(profile1)
    db.session.add(profile2)
    db.session.add(profile3)
    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the profiles table.
def undo_profiles():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.user_profiles RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM profiles"))

    db.session.commit()
