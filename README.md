## Getting started 

This project creates firebase firestore data for testing purposes. 

* In order to use it, create a firebase project && initialize firestore. 
* In firebase console, go to project settings, and then service accounts. 
* From the Node.js configuration details, copy the  `databaseURL` and replace it with the one in `config.js` in this project. 
* While still on the same page in firebase, click on generate new private key. 
* Create a file in the top directory level in this project called `serviceAccount.json`. This file is imported from `config.js` as `serviceAccount`. Copy the files generated from the previous step into this file. 
* Run `npm i && node index.js` to start this project. 