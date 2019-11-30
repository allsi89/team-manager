import {
    loadAllPartials,
    setSessionInfo
} from "../helpers.js";

import {
    post
} from "../requester.js";

export const userController = {

    getRegister: function (ctx) {
        const partials = {
            registerForm: "../templates/register/registerForm.hbs"
        };
        loadAllPartials(ctx, partials)
            .partial("../templates/register/registerPage.hbs")
    },

    postRegister: function (ctx) {
        const {
            username,
            password,
            repeatPassword
        } = ctx.params;

        if (username && password && repeatPassword) {
            if(password === repeatPassword) {
                post("user", "", {
                    username,
                    password,
                    teamId: null
                }, "Basic")
                .then(uData => {
                    setSessionInfo(uData);
                    ctx.redirect("/login");
                })
                .catch(console.error);
            } else {
                alert("Passwords don't match!")
            }
           
        } else {
            alert("No empty fields allowed!")
        }
    },

    getLogin: function (ctx) {
        const partials = {
            loginForm: "../templates/login/loginForm.hbs"
        };
        loadAllPartials(ctx, partials)
            .partial("../templates/login/loginPage.hbs");
    },

    postLogin: function (ctx) {
        const {
            username,
            password,
        } = ctx.params;

        if(username && password) {
            post("user", "login", {
                username,
                password
            }, "Basic")
            .then(uData => {
                setSessionInfo(uData);
                ctx.redirect("/home");
            })
            .catch(e => {
                alert("Wrong username or password!");
                console.error(e);
            });
        }
    },

    logout: function (ctx) {
        post("user", "_logout", {}, "Kinvey")
        .then(() => {
            sessionStorage.clear();
            ctx.redirect("/")
        })
        .catch(console.error);
    }
}