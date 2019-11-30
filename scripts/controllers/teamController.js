import {
    loadAllPartials,
    getSessionInfo
} from "../helpers.js";

import {
    get,
    put,
    post
} from "../requester.js";

export const teamController = {
    getTeamInfo: function (ctx) {
        getSessionInfo(ctx);
        const id = ctx.params.teamId;
        const linkParams = `${location.protocol}//${location.host}`;

        get("appdata", `teams/${id}`, "Kinvey")
            .then(tData => {
                ctx.name = tData.name;
                ctx.description = tData.description;
                ctx.isAuthor = tData._acl.creator === ctx.userId;
                ctx.members = tData.members;
                ctx.teamId = tData._id;

                ctx.isOnTeam = tData.members.map(m => m.id).includes(ctx.userId);


                const partials = {
                    teamMember: `${linkParams}/templates/catalog/teamMember.hbs`,
                    teamControls: `${linkParams}/templates/catalog/teamControls.hbs`
                }

                loadAllPartials(ctx, partials)
                    .partial(`${linkParams}/templates/catalog/details.hbs`);

            })
            .catch(console.error);
    },

    getCreate: function (ctx) {
        getSessionInfo(ctx);

        const partials = {
            createForm: "../templates/create/createForm.hbs"
        }

        loadAllPartials(ctx, partials)
            .partial("../templates/create/createPage.hbs");

    },

    postCreate: function (ctx) {
        getSessionInfo(ctx);
        const {
            name,
            description
        } = ctx.params;

        if (name && description) {
            const members = [];
            const userId = ctx.userId;

            members.push({
                id: userId,
                username: ctx.username
            });

            get("user", userId, "Kinvey")
                .then(uData => {
                    if (uData.teamId === null) {
                        post("appdata", "teams", {
                                name,
                                description,
                                members
                            }, "Kinvey")
                            .then((data) => {
                                return put("user", userId, {
                                    teamId: data._id
                                }, "Kinvey")
                            })
                            .then(ctx.redirect("/catalog"))

                    } else {
                        let msg = "You must leave all teams before you can create a new one!"
                        alert(msg)
                        throw new Error(msg)
                    }
                })
                .catch(console.error);
        } else { 
            alert("You need to fill all fields!")
        }

    },

    getEdit: function (ctx) {
        getSessionInfo(ctx);
        ctx.teamId = ctx.params.teamId;

        get("appdata", `teams/${ctx.teamId}`, "Kinvey")
            .then(tData => {
                ctx.name = tData.name;
                ctx.description = tData.description;
                ctx.isAuthor = tData._acl.creator === ctx.userId;
                ctx.members = tData.members;
                ctx.teamId = tData._id;

                const partials = {
                    editForm: "../templates/edit/editForm.hbs"
                }

                loadAllPartials(ctx, partials)
                    .partial("../templates/edit/editPage.hbs");
            })
            .catch(console.error)
    },

    postEdit: function (ctx) {
        getSessionInfo(ctx);
        const {
            name,
            description,
            teamId
        } = ctx.params;

        if(name && description && teamId) {
            get("appdata", `teams/${teamId}`, "Kinvey")
            .then(tData => {
                if (tData._acl.creator !== ctx.userId) {
                    let msg = "Unauthorized operation! Only the team creator can edit!";
                    alert(msg);
                    throw new Error(msg);
                }
                return tData;
            })
            .then(tData => put("appdata", `teams/${teamId}`, {
                name,
                description,
                members: tData.members
            }, "Kinvey"))
            .then(() => ctx.redirect(`/catalog/${teamId}`))
            .catch(console.error);
        } else {
            alert("You need to fill all fields!")
        }
    },

    join: function (ctx) {
        getSessionInfo(ctx);
        const id = ctx.params.teamId;

        get("user", ctx.userId, "Kinvey")
            .then(uData => {
                let isOnTeam = uData.teamId !== null;
                if (!isOnTeam) {
                    return get("appdata", `teams/${id}`, "Kinvey")
                } else {
                    const msg = "You have already joined a team!";
                    alert(msg);
                    throw new Error(msg);
                }
            })
            .then(tData => {
                tData.members.push({
                    id: ctx.userId,
                    username: ctx.username
                })
                return tData;
            })
            .then(tData => put("appdata", `teams/${id}`, tData, "Kinvey"))
            .then(tData => put("user", ctx.userId, {
                teamId: tData._id
            }, "Kinvey"))
            .then(() => {
                ctx.redirect(`/catalog/${id}`);
            })
            .catch(console.error);

    },

    leave: function (ctx) {
        getSessionInfo(ctx);
        const id = ctx.params.teamId;

        get("appdata", `teams/${id}`, "Kinvey")
            .then(tData => {
                tData.members = tData.members.filter(m => m.id !== ctx.userId);
                return tData;
            })
            .then(data => put("appdata", `teams/${id}`, data, "Kinvey"))
            .then(() => put("user", ctx.userId, {
                teamId: null
            }, "Kinvey"))
            .then(() => {
                ctx.redirect(`/catalog/${id}`);
            })
            .catch(console.error);
    }
}