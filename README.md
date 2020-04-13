This is the README

Install MongoDB server and client from Ubuntu repository

$ sudo apt install mongodb
$ sudo apt install mongodb-clients

Check it's working 

$ sudo systemctl status mongodb

Connect and have a look

$ mongo

Then:

show dbs
use auth_demo_app
show collections
db.users.find()


