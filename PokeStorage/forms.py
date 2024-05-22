from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, IntegerField
from wtforms.validators import InputRequired, Length, NumberRange

class SignupForm(FlaskForm):
    username = StringField("Username", validators=[InputRequired(message="Must provide a username"), 
                                                   Length(max=20, message="Limit - 20 characters")], )
    password = PasswordField("Password", validators=[InputRequired(message="Must provide a password")])

class LoginForm(FlaskForm):
    username = StringField("Username", validators=[InputRequired(message="Must input a username")])
    password = PasswordField("Password", validators=[InputRequired(message="Must input a password")])

class EditPokemonForm(FlaskForm):
    cp = IntegerField("cp", validators=[InputRequired(message="Must include a CP")])
    atk = IntegerField("attack", validators=[NumberRange(min=0, max=15, message="IV must be between 0 and 15")])
    dfn = IntegerField("defense", validators=[NumberRange(min=0, max=15, message="IV must be between 0 and 15")])
    hp = IntegerField("hp", validators=[NumberRange(min=0, max=15, message="IV must be between 0 and 15")])

class AddPokemonForm(FlaskForm):
    name = StringField("PokemonName", validators=[InputRequired(message="Must provide a username")])
    cp = IntegerField("cp", validators=[InputRequired(message="Must include a CP")])
    atk = IntegerField("attack", validators=[NumberRange(min=0, max=15, message="IV must be between 0 and 15")])
    dfn = IntegerField("defense", validators=[NumberRange(min=0, max=15, message="IV must be between 0 and 15")])
    hp = IntegerField("hp", validators=[NumberRange(min=0, max=15, message="IV must be between 0 and 15")])
