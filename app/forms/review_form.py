from flask_wtf import FlaskForm
from wtforms import TextAreaField, SelectField
from wtforms.validators import InputRequired, Length

from app.api.review_routes import review

class ReviewForm(FlaskForm):
    review_text = TextAreaField('Review', validators=[InputRequired(), Length(min=10, max=255)])
    stars = SelectField('Stars', validators=[InputRequired()], choices=[('1','1'), ('2','2'),('3','3'), ('4','4'), ('5','5')], default='1')