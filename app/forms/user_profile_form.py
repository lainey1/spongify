from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import InputRequired, TextAreaField, Length, Optional

class UserProfileForm(FlaskForm):
    location = StringField('City, State', validators=[InputRequired(), Length(min=1, max=255)])
    cuisine = StringField('Cuisine', validators=[Optional(), Length(max=50)])
    headline = TextAreaField('Headline', validators=[InputRequired(), Length(min=3, max=60)])
