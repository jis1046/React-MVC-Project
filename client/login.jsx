const helper = require('./helper.js');
const React = require('react');
const {createRoot} = require('react-dom/client');

const handleLogin = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    if(!username || !pass) {
        helper.handleError('Username or password is empty!');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass});
    return false;
}

const handleSignup = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;
    const email = e.target.querySelector('#email').value;

    if(!username || !pass || !pass2 || !email) {
        helper.handleError('All fields are required!');
        return false;
    }

    if( pass !== pass2) {
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass, pass2, email});

    return false;
}

const handlePasswordChange = (e) => {
    e.preventDefault();
    helper.hideError();

    const email = e.target.querySelector('#email').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if(!email || !pass || !pass2 ) {
        helper.handleError('All fields are required!');
        return false;
    }

    if( pass !== pass2) {
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, {email, pass, pass2});

    return false;



}

const LoginWindow = (props) => {
    return (
        <form id="loginForm"
        name="loginForm"
        onSubmit={handleLogin}
        action="/login"
        method="POST"
        className="mainForm"
    >
        <label htmlFor="username">Username: </label>
        <input id="user" type="text" name="username" placeholder="username" />
        <label htmlFor="pass">Password: </label>
        <input id="pass" type="password" name="pass" placeholder="password" />
        <input className="formSubmit" type="submit" value="Sign in" /> 
        <input id="changePasswordSubmit" type="button" value="Change Password" onClick={
            (e) => {
                e.preventDefault();
                props.root.render( <ChangePasswordWindow /> );
                return false;
            }
        } /> 
    </form>

    );
};

const SignupWindow = (props) => {
    return (
        <form id="signupForm"
            name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <label htmlFor="pass">Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder=" retype password" />
            <label htmlFor="email">Email: </label>
            <input id="email" type="text" name="email" placeholder="email" />
            <input className="formSubmit" type="submit" value="Sign up" />
        </form>
    );
};

const ChangePasswordWindow = (props) => {
    return (
        <form id="changePasswordForm"
            name="changePasswordForm"
            onSubmit={handlePasswordChange}
            action="/changePassword"
            method="POST"
            className="mainForm"
        >
        <label htmlFor="email">Email: </label>
        <input id="email" type="email" name="email" placeholder="email" />
        <label htmlFor="pass">Password: </label>
        <input id="pass" type="password" name="pass" placeholder="password" />
        <label htmlFor="pass">Password: </label>
        <input id="pass2" type="password" name="pass2" placeholder=" retype password" />
        <input className="formSubmit" type="submit" value="Enter" />
        </form>

        
    );
};

const init = () => {
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

    const root = createRoot(document.getElementById('content'));

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( <LoginWindow root={root}/> );
        return false;
    });

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( <SignupWindow /> );
        return false;
    });

  
    

    root.render( <LoginWindow  root={root}/> );
};

window.onload = init;

