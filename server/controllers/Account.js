const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => res.render('login');

// const signupPage = (req, res) => res.render('signup');

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }
  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const passwordChange = async (req, res) => {
  const { email } = req.body;
  const newPass = req.body.pass;
  const newPass2 = req.body.pass2;

  if (!email || !newPass || !newPass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  try {
    const account = await Account.changePasswordAuthenticate(email);

    if (!account) {
      return res.status(401).json({ error: 'Incorrect email!' });
    }

    if (newPass !== newPass2) {
      return res.status(400).json({ error: 'Passwords do not match!' });
    }

    const hash = await Account.generateHash(newPass);

    // Update password with hashed value
    account.password = hash;

    // Save the updated password
    await account.save();

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/' });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ error: 'Internal server error!' });
  }
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;
  const email = `${req.body.email}`;

  if (!username || !pass || !pass2 || !email) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash, email });

    const error = newAccount.validateSync();
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }

    return res.status(500).json({ error: 'An error occured!' });
  }
};

module.exports = {
  loginPage,
  logout,
  login,
  signup,
  passwordChange,
};
