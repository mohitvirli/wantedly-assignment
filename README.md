# Wantedly Assignment


> You can have the live demo [here](http://35.201.166.198/)

This app was generated using express-generator.
This app serves as the solution to the assignment given by [Wantedly](https://in.wantedly.com/) in the following gist [gist](gist.github.com/luvtechno/1680e142589f8a6017d1ebbcdb4cd325)

### Tech stack used

I have used the following to implement the assignment

* [Node.js] - to create the server
* [Express] -  the nodejs framework
* [MongoDB]- The database used
* [Babel] - To transpile the ES6 code.
* [Twitter Bootstrap] - CSS framework
* [jQuery] - JS library
* [Google Cloud](http://cloud.google.com) - To host the app

### Installation

This requires [Node.js](https://nodejs.org/) v4+ and [MongoDB] to run.

You can get the instructions to install MongoDB [here](https://docs.mongodb.com/manual/installation/)

You will have to start the `mongod` service to start the DB.
```
$ sudo service start mongod
```

Clone the repo and Install the dependencies and devDependencies and start the server.
(You can use `yarn` instead of `npm i` for the obvious reasons)

```sh
$ npm i
$ npm start
```

Then go to http://localhost:3000.

### Features

 - On the landing page, you can log in through various users by just clicking at the user, and create a new user by using the adjacent form.
- After clicking on the user you are redirected to his/her profile page. Here you can add your skill or endorse the skill listed.
- You have friends list where you can look at the other profiles and do the same with the skills.
- The url with `?(id)` slug determines the user, if not present, it is the current users profile.
- Used localStorage to maintain the session


### Todos

 - I need to implement [Mongoose](mongoosejs.com) to implement the MongoDB schemas and further reduce the pain of writing more code. Although I could have used it way earlier, I had to learn core MongoDB. So used that instead.
- I have to make the app production ready. As I have deployed the app using `babel-node` and used the development mode.
- Check for some corner cases.



   [node.js]: <http://nodejs.org>
   [MongoDB]: <https://www.mongodb.com/>
   [Babel]: <http://babeljs.io//>
   [Twitter Bootstrap]: <http://twitter.github.com/bootstrap/>
   [jQuery]: <http://jquery.com>
   [express]: <http://expressjs.com>
