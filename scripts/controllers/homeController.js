import {
    getSessionInfo,
    loadAllPartials
} from "../helpers.js";

import {get} from "../requester.js"

export const homeController = {
    getHome: function (ctx) {
        getSessionInfo(ctx);
        if(ctx.loggedIn) {
            get("user", ctx.userId, "Kinvey")
            .then(uData => {
                ctx.hasTeam = uData.teamId !== null;
                ctx.teamId = uData.teamId;
                loadAllPartials(ctx)
                .partial("../templates/home/home.hbs");
            })
            .catch(console.error);
        } else {
            loadAllPartials(ctx)
            .partial("../templates/home/home.hbs");
        }
    },

    getAbout: function (ctx) {
        getSessionInfo(ctx);
        loadAllPartials(ctx)
            .partial("../templates/about/about.hbs");
    }
}