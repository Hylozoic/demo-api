#What is the Demo API?
This Demo API was created as a stub to extract dependance on a third party vendor during development. It was also created to reduce the latency of working with the blockchain, instead this API would simulate the third party vendor in terms of the expected endpoints, behaviour and responses.
The Demo API is not a complete solution, rather a test suite for a project specific purpose. We welcome the project be forked and extended although it currently suits the needs of the project.

#Environment Variables
```
REDIS_URL=redis://localhost:6379
```

#Dependencies
To Setup and Start the project
bash
```
npm install
npm install -g mocha
npm install -g newman
npm start
```

#Running tests

Unit tests
```
npm test
```
Integration tests
```
npm newman
```

#Using the API

The API has many endpoints for different functionality, an endpoint can be reached with the domain name followed by the route you wish to hit, for example;
```
http://localhost:3000/api/stabletoken/balances
```
A majority of the endpoint require an authorisation token which can be obtained through the built in OAuth flow.
