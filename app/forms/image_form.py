from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import Optional 

class ImageForm(FlaskForm):
    images = StringField('Image Url', validators=[Optional()])