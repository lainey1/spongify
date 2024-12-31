from flask_wtf import FlaskForm
from wtforms import DateTimeLocalField, SelectField
from wtforms.validators import InputRequired, ValidationError
from datetime import datetime

# Future date validation function
def future_date(form, field):
    if field.data is None:
        raise ValidationError("The reservation date is required.")

    if field.data < datetime.now():
        raise ValidationError("The reservation date must be in the future.")

# Choices for party size (1-20)
party_size_choices = [(str(i), str(i)) for i in range(1, 21)]

class ReservationForm(FlaskForm):
    # Explicitly specify the format for DateTimeLocalField
    date = DateTimeLocalField('Date and Time',
                              format="%Y-%m-%dT%H:%M:%S",  # Ensures correct parsing
                              validators=[InputRequired(), future_date])

    # Select field for party size with options from 1 to 20
    party_size = SelectField('Number of Guests', validators=[InputRequired()],
                             choices=party_size_choices, default='1')
