from flask_wtf import FlaskForm
from wtforms import TextAreaField, SelectField
from wtforms.validators import InputRequired, Length

class ReviewForm(FlaskForm):
    review = TextAreaField('Review', validators=[InputRequired(), Length(min=10, max=255)])
    stars = SelectField('Stars', validators=[InputRequired()], choices=[('1','1'), ('2','2'),('3','3'), ('4','4'), ('5','5')], default='1')