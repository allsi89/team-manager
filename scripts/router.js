import { homeController } from "./controllers/homeController.js";
import { userController } from "./controllers/userController.js";
import { catalogController } from "./controllers/catalogController.js";
import {teamController} from "./controllers/teamController.js";

export default function Router(app) {
    app.get("/", homeController.getHome);
    app.get("/index.html", homeController.getHome);
    app.get("/home", homeController.getHome);
    app.get("/about", homeController.getAbout);

    app.get("/register", userController.getRegister);
    app.post("/register", userController.postRegister);
    app.get("/login", userController.getLogin);
    app.post("/login", userController.postLogin);
    app.get("/logout", userController.logout);


    app.get("/catalog", catalogController.getCatalog);

    app.get("/catalog/:teamId", teamController.getTeamInfo);

    app.get("/create", teamController.getCreate);
    app.post("/create", teamController.postCreate);

    app.get("/edit/:teamId", teamController.getEdit);
    app.post("/edit/:teamId", teamController.postEdit);

    app.get("/join/:teamId", teamController.join)
    app.get("/leave/:teamId", teamController.leave);
}