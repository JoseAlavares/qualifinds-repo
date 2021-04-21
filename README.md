# Proyecto MERN

## Author
Jose Francisco Alvarez Valdez alvaresvaldes89@outlook.es

## Credentials for the login
```
user: alvaresvaldes89@gmail.com
password: admin

user: alvaresvaldes89@outlook.es
password: admin
````

## Requirements
  - Docker
  - docker-compose
  - Any code editor like Visual Code or Sublime Text
  - Any database administration tool like DBeaver or HeidiSQL
  - Git client

## Install docker and docker compose
    - https://docs.docker.com/engine/install/
    - https://docs.docker.com/compose/install/
    
## Run the backend in a local enviroment:

- In Linux enviroments please refer in the section on installation docker to configure administrative permissions in docker

Please type the next comands in your command prompt like Bash or PowerShell

Clone the repository
```
git clone git@url-repo.git
```
Change the path to the real path in your pc
```
cd /path/to/repository/back-end
```
Up containers with docker-compose
```
docker-compose up -f Dockerfile.local -d --build
```
## Run the front-end in a local enviroment:
>This project use RecoilJS  instead  of using Redux, RecoilJS is a global state management 
```
cd /path/to/repository/front-end
npm i
npm start
```
### License

Copyright (C) 2021 Jose Francisco Alvarez Valdez  
 All rights reserved.
----