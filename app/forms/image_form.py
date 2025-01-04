from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField
from wtforms.validators import Optional

class ImageForm(FlaskForm):
    image_url = StringField('Image Url', validators=[Optional()])
    is_preview = BooleanField('Is Preview Image', validators=[Optional()])