from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SelectField
from wtforms.validators import InputRequired, Optional, Length, ValidationError

# Email validator can be customized as needed
def email_validator(form, field):
    email = field.data
    # Example condition: Uncomment and modify for your validation logic
    # if not email.endswith('@something.com'):
    #     raise ValidationError('Email must be from something.com domain.')

# Define common time range for the dropdowns
TIME_CHOICES = [
    ('Closed', 'Closed'),
    ('12:00 AM', '12:00 AM'), ('1:00 AM', '1:00 AM'), ('2:00 AM', '2:00 AM'),
    ('3:00 AM', '3:00 AM'), ('4:00 AM', '4:00 AM'), ('5:00 AM', '5:00 AM'),
    ('6:00 AM', '6:00 AM'), ('7:00 AM', '7:00 AM'), ('8:00 AM', '8:00 AM'),
    ('9:00 AM', '9:00 AM'), ('10:00 AM', '10:00 AM'), ('11:00 AM', '11:00 AM'),
    ('12:00 PM', '12:00 PM'), ('1:00 PM', '1:00 PM'), ('2:00 PM', '2:00 PM'),
    ('3:00 PM', '3:00 PM'), ('4:00 PM', '4:00 PM'), ('5:00 PM', '5:00 PM'),
    ('6:00 PM', '6:00 PM'), ('7:00 PM', '7:00 PM'), ('8:00 PM', '8:00 PM'),
    ('9:00 PM', '9:00 PM'), ('10:00 PM', '10:00 PM'), ('11:00 PM', '11:00 PM')
]

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

    # Cuisine dropdown now with predefined choices
    cuisine = SelectField('Cuisine', choices=POPULAR_CUISINES, validators=[Optional()])

    # Price point dropdown
    price_point = SelectField('Price Point', choices=[('1', '$1-$10'), ('2', '$11-$30'), ('3', '$31-$60'), ('4', '$61-$100'), ('5', 'Over $100')], validators=[Optional()])

    # Description field
    description = TextAreaField('Description', validators=[Optional(), Length(max=500)])

    # Separate fields for opening and closing times for each day of the week
    monday_open = SelectField('Monday Open', choices=TIME_CHOICES, default='Closed')
    monday_close = SelectField('Monday Close', choices=TIME_CHOICES, default='Closed')

    tuesday_open = SelectField('Tuesday Open', choices=TIME_CHOICES, default='Closed')
    tuesday_close = SelectField('Tuesday Close', choices=TIME_CHOICES, default='Closed')

    wednesday_open = SelectField('Wednesday Open', choices=TIME_CHOICES, default='Closed')
    wednesday_close = SelectField('Wednesday Close', choices=TIME_CHOICES, default='Closed')

    thursday_open = SelectField('Thursday Open', choices=TIME_CHOICES, default='Closed')
    thursday_close = SelectField('Thursday Close', choices=TIME_CHOICES, default='Closed')

    friday_open = SelectField('Friday Open', choices=TIME_CHOICES, default='Closed')
    friday_close = SelectField('Friday Close', choices=TIME_CHOICES, default='Closed')

    saturday_open = SelectField('Saturday Open', choices=TIME_CHOICES, default='Closed')
    saturday_close = SelectField('Saturday Close', choices=TIME_CHOICES, default='Closed')

    sunday_open = SelectField('Sunday Open', choices=TIME_CHOICES, default='Closed')
    sunday_close = SelectField('Sunday Close', choices=TIME_CHOICES, default='Closed')
