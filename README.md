# Project_name
Here a description of the project. 

## About us
Hi! this is a description of all the developers that contributed to this project 

![Project Image](https://assets.website-files.com/5c755d7d6fa90e6b6027e74c/642fe45b20446d4f867135fb_%D0%A1over.jpg "Project Image")

## Deployment
You can check the app fully deployed [here](https://be.green/es/blog/guia-de-cuidado-de-los-cactus/).

## Work structure
We developed this project using [Trello](https://trello.com/home) to organize our workflow.

## Installation guide
- Fork this repo
- Clone this repo 

```shell
$ cd folder-project
$ npm install
$ npm start
```

## Models
#### User.model.js
```js
const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }
});
```
#### Cactus.model.js
```js
const cactusSchema = new Schema({
  title: { type: String, required: true },
  user: { type: Schema.Types.ObjectID, ref: "User" }
});
```

## User roles
| Role  | Capabilities                                                                                                                               | Property       |
| :---: | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| Admin  | Can login/logout. Can do ... | role: "admin" |
| Gardener | Can login/logout. Can do ... | role: "gardener" |
| Registered User | Can login/logout. Can do ... ||

## Routes
| Metodo |     endPoint     |                  Requiere                   |                  Accion                  |
| :----: | :--------------: | :-----------------------------------------: | :--------------------------------------: |
|  GET   |        /         |                                             |              Carga el home               |
|  GET   |     /singup      |                                             |             Carga el Sign Up             |
|  POST  |     /singup      |   const {name, password, city} = req.body   |  Register the user and redirects to /login |
|  GET   |      /login      |                                             |             Carga el Log in              |
|  POST  |      /login      |      const {name, password} = req.body      |     Logs a user in and redirects to home |
|  GET   |    /post/:id     |           const {id} = req.params           |        Shows the selected post           |
|  ...   |    ...     |          ...         |       ...          |


## API
This project consumes this [API](https://api.chucknorris.io/) to make some random phrases appear in the home page.

---






SPELLS ---> agafar dates amb el axios, solament mostrar. 

Profile ---> spellls cridar api amb axios agafar un dels camps del nom, s'han de guardar a la base de dates ([object]). POST PROFILE I UN REDIRECT A "/". Valor propety: undefiend. 4 valors definits en tema objecte. 
