# SPProject
#### Created by: Kai Crabb, Christopher Carter, Elijah Carney

A project for our Secure Programming class that involves a website with a simple game where users can create accounts and compete for the highest score. Users create accounts with unique usernames and passwords that require at least 8 characters, 1 symbol, 1 uppercase letter, 1 lowercase letter and a number. The password and username are then sent to a database on the server end and the password is hashed using salt library in react. Users can access their profile screens to see their information, select characters, select profile images, change a password, logout, get back to the game page, or delete their account. This project allowed us to experiment with input validation, blocking off parts of our site, hashing, and database management.

To see a more detailed description of what we did check out our [Secure Programming Project Documentation](https://docs.google.com/document/d/1Q-EVXA85dpTEArRChdBAZe1sz3k3xiv-F-u2I9oYxjs/edit?usp=sharing).
To test it for yourself install mongodb community server and node.js then follow the commands below, for a more detailed set of directions look at the introduction of the mentioned documentation. 

## Backend setup Commands
* cd backend
* npm install mongoose
* npm install bcryptjs
* npm install cors
* npm install jsonwebtoken
* npm install dayjs
* npm install body-parser
* npm install express
* or just do ```cd backend | npm install mongoose bcryptjs cors jsonwebtoken dayjs body-parser express```
#### <b>START BACKEND:</b>
1. cd backend
2. npm run dev

## Frontend setup Commands
* cd frontend
* npm install react-router
* npm install react-router-dom
* or just do ```cd frontend | npm install react-router react-router-dom```
#### <b>START FRONTEND:</b>
1. cd frontend
2. npm start
