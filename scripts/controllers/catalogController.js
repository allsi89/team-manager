import {
    getSessionInfo,
    loadAllPartials
} from "../helpers.js";

import {
    get
} from "../requester.js"

export const catalogController = {
    //WORKS
    getCatalog: function (ctx) {
        getSessionInfo(ctx);

        get("appdata", "teams", "Kinvey")
            .then(data => {
                ctx.teams = data;

                const partials = {
                    team: "../templates/catalog/team.hbs"
                };
                loadAllPartials(ctx, partials)
                    .partial("../templates/catalog/teamCatalog.hbs");

            })
            .catch(console.error)
    }
}