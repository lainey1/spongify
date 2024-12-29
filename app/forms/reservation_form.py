from flask_wtf import FlaskForm
from wtforms import DateTimeLocalField, SelectField
from wtforms.validators import InputRequired, ValidationError
from datetime import datetime

def future_date(form, field):
    if field.data < datetime.now():
        raise ValidationError("The reservation date must be in the future.")

party_size_choices = [(str(i), str(i)) for i in range(1, 21)]  

class ReservationForm(FlaskForm):
    date = DateTimeLocalField('Date and Time', validators=[InputRequired(), future_date])    
    party_size = SelectField('Number of Guests', validators=[InputRequired()], 
                             choices=party_size_choices, default='1')

