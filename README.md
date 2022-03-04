![image](https://user-images.githubusercontent.com/86835927/156650607-58f2952a-d1e8-473f-9508-f043dc1caf29.png)

*If you just want to run it locally and don't want any explanation, you can skip to the [How to run it locally](#howToRunLocally) part*

# What is this project about?
It is a Password Manager, I created it because I wanted to test my skills on React with TypeScript for the FrontEnd and Express with MongoDB for the BackEnd. I'm sure that Security-wise, it's not the best and doesn't pass on all requirements, that's why it's surely not ready for deployment. I'll try to make this project as secure as it can be, and whenever I acquire new knowledge on security, I'll be updating this repository.

# What I've learned with this project
I've learned many things in this project, and I'm gonna list it here:
1. TypeScript 
    * Making Interfaces.
    * Working with event.
2. Express folder structuring
    * Creating a models folder that will hold the Schemas and export the model.
4. Mongoose functions
    * Inside the method `findOneAndUpdate()`, using `$push:{websites: req.body.newWebsite}` to push a new object inside the websites array(defined on the Schemas).
    * Learned how to handle user inputs by narrowing down common errors like user entering no password for registration or passwords with not enough characters by sanitizing on the BackEnd.
6. Axios API Calls
    * Making POST requests with data so that the BackEnd can identify if the user is logged and if he is able to do anything, being able to GET, POST and DELETE.
8. JWT(JSON Web Token)
    * Creating a token for the user when he signs in and store it on localStorage for identification so that it's possible to manage if user is logged in or not.
11. Saving text to clipboard
    * Created my own logic to see whick input the user is clicking to copy(Most surely there is a way to do it easier)

# <p name="howToRunLocally">How to run it locally</p>

Run `yarn install` on both `client` and `server`.

If you don't have Yarn installed, run `npm install --global yarn`.

If you don't know what yarn is, you can checkout this [documentation](https://classic.yarnpkg.com/en/ "Yarn's documentation") from them.

You'll also need to create on the `server` folder, a .env file with the variables needed for the Web App to work:
```env
DB_URI = "String" # String that links to your MongoDB Database
JWT_SECRET = "String" # A long string that is also unique for making your JWT token unique
SALT_ROUNDS = number # A number of salting rounds you want to do in your bcrypt(used when hashing user's password)
```
