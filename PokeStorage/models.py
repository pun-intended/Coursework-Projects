from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()

def connect_db(app):
    """Connect to database"""
    db.app = app
    db.init_app(app)
    print("connected to DB")

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)

    user_mon = db.relationship("UserMon", backref="user", cascade="all, delete")

    @classmethod
    def register(cls, username, pwd):
        print(f"registering user {username}")
        hash = bcrypt.generate_password_hash(pwd)
        hash_decoded = hash.decode("utf8")
        return cls(username=username, password=hash_decoded)
    
    @classmethod
    def authenticate(cls, username, pwd):
        print("authenticating user")
        user = User.query.filter_by(username=username).first()
        if user and bcrypt.check_password_hash(user.password, pwd):
            return user
        else:
            return False
    
    @classmethod
    def user_exists(cls, username):
        print("verifying user exists")
        user = User.query.filter_by(username=username).first()
        if user:
            return True
        else:
            return False

class UserMon(db.Model):
    __tablename__ = "usermon"

    owns_id = db.Column(db.Integer, primary_key=True, nullable=False)
    pokemon_id = db.Column(db.Integer, db.ForeignKey("pokemon.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    cp = db.Column(db.Integer)
    atk = db.Column(db.Integer)
    dfn = db.Column(db.Integer)
    hp = db.Column(db.Integer)
    

class Pokemon(db.Model):
    __tablename__ = "pokemon"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String, nullable=False)

    user_mon = db.relationship("UserMon", backref="pokemon", cascade="all, delete")