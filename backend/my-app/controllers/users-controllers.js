
const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
  //User.find({}, 'email name')
  //finds the email and name
  //This will return everything exept the passord
  //esentially returning the email and name
  let users;
  try {
    users = User.find({}, '-password');
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({
    users: (await users).map((user) => user.toObject({ getters: true })),
  });
};


const signup = async (req, res, next) => {

  //Pulling the info from the user input
  const { name, email, password } = req.body;

  //Getting the email in the db to see if the email exists
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  //If the email already exists an error is sent
  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    );
    return next(error);
  }

  //Create user
  const createdUser = new User({
    name,
    email,
    password,
    translations: [],
  });
  console.log(createdUser)
  //Saving the use to the db
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('Sigingup Up failed, please try again.', 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};


const login = async (req, res, next) => {
    const { email, password } = req.body;

    //Searching for email in the db
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email })
    } catch (err) {
        const error = new HttpError(
            'Loggin in failed, please try again later.', 500
        );
        return next(error);
    }

    //Validating user
    //if user does not exist or if there password does not
    //match what is in the db throw error
    if (!existingUser || existingUser.password != password) {
        const error = new HttpError(
            'Invalid credentials, could not log you in.', 401
        );
        return next(error)
    }

    res.json({message: 'Login in!'});
};
 
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
