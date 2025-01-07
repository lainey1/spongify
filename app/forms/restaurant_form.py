from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SelectField
from wtforms.validators import InputRequired, Optional, Length, ValidationError
from ..constants import TIME_CHOICES

# Email validator can be customized as needed
def email_validator(form, field):
    email = field.data
    # Example condition: Uncomment and modify for your validation logic
    # if not email.endswith('@something.com'):
    #     raise ValidationError('Email must be from something.com domain.')


class RestaurantForm(FlaskForm):
    # Basic restaurant information
    name = StringField('Name', validators=[InputRequired(), Length(min=1, max=95)])
    address = StringField('Address', validators=[InputRequired(), Length(min=1, max=255)])
    city = StringField('City', validators=[InputRequired(), Length(min=1, max=100)])
    state = StringField('State', validators=[InputRequired(), Length(min=1, max=100)])
    country = StringField('Country', validators=[InputRequired(), Length(min=1, max=100)])
    phone_number = StringField('Phone Number', validators=[Optional(), Length(min=10, max=15)])
    email = StringField('Email', validators=[email_validator, Optional(), Length(max=255)])
    website = StringField('Website', validators=[Optional(), Length(max=255)])

    POPULAR_CUISINES = [
        ('American', 'American'),
        ('African', 'African'),
        ('Chinese', 'Chinese'),
        ('French', 'French'),
        ('Greek', 'Greek'),
        ('Indian', 'Indian'),
        ('Italian', 'Italian'),
        ('Japanese', 'Japanese'),
        ('Korean', 'Korean'),
        ('Mediterranean', 'Mediterranean'),
        ('Mexican', 'Mexican'),
        ('Middle Eastern', 'Middle Eastern'),
        ('Spanish', 'Spanish'),
        ('Thai', 'Thai'),
        ('Vietnamese', 'Vietnamese'),
        ('Other', 'Other'),
    ]


    # Cuisine dropdown now with predefined choices
    cuisine = SelectField('Cuisine', choices=POPULAR_CUISINES, validators=[Optional()])

    # Price point dropdown
    price_point = SelectField('Price Point', choices=[('1', '$10 and under'), ('2', '$11 - $30'), ('3', '$31 - $60'), ('4', '$61-$100'), ('5', 'Over $100')], validators=[Optional()])

    # Description field
    description = TextAreaField('Description', validators=[Optional(), Length(max=500)])

    # Separate fields for opening and closing times for each day of the week
    monday_open = SelectField('Monday Open', choices=TIME_CHOICES, default='10:00 AM')
    monday_close = SelectField('Monday Close', choices=TIME_CHOICES, default='10:00 PM')

    tuesday_open = SelectField('Tuesday Open', choices=TIME_CHOICES, default='10:00 AM')
    tuesday_close = SelectField('Tuesday Close', choices=TIME_CHOICES, default='10:00 PM')

    wednesday_open = SelectField('Wednesday Open', choices=TIME_CHOICES, default='10:00 AM')
    wednesday_close = SelectField('Wednesday Close', choices=TIME_CHOICES, default='10:00 PM')

    thursday_open = SelectField('Thursday Open', choices=TIME_CHOICES, default='10:00 AM')
    thursday_close = SelectField('Thursday Close', choices=TIME_CHOICES, default='10:00 PM')

    friday_open = SelectField('Friday Open', choices=TIME_CHOICES, default='10:00 AM')
    friday_close = SelectField('Friday Close', choices=TIME_CHOICES, default='10:00 PM')

    saturday_open = SelectField('Saturday Open', choices=TIME_CHOICES, default='10:00 AM')
    saturday_close = SelectField('Saturday Close', choices=TIME_CHOICES, default='10:00 PM')

    sunday_open = SelectField('Sunday Open', choices=TIME_CHOICES, default='10:00 AM')
    sunday_close = SelectField('Sunday Close', choices=TIME_CHOICES, default='10:00 PM')
