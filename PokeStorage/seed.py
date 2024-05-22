from models import User, UserMon,  db

def seed_users():
    print("seeding Users")
    
    db.drop_all()

    print("dropped db")
    db.create_all()

    print("creates db")
    

    u1 = User(username="test1", password="testpass")

    print("Users created")
    # u2 = User.register("test2", "testpass")

    # allUsers = [u1, u2]

    # db.session.add_all(allUsers)
    db.session.add(u1)

    print("added Users to session")
    db.session.commit()
    
    print("commit complete")
    user = User.query.filter_by(username="test1").first()
    print(user)