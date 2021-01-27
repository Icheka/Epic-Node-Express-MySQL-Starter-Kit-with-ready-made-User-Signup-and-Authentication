const HttpClass = require("../utils/Http.class");
const jwt = require("jsonwebtoken");
const User_model = require("../models/User_model");
const User = require("../controllers/User");
const _error = require("../_handlers/_Error.class");

function auth() {
    return async function (req, res, next) {
        const Http = new HttpClass();
        Http.log(req, "req");
        // console.log(`Request headers :>> ${req.headers}`);
        try {
            const authBearer = req.headers.bearer;
            const authHeader = req.headers.authorization;

            if (!authBearer || !authHeader) {
                Http.emit(res, 402, null, "Authorization header(s) absent in request.");
            }

            let isUser = await User.isUserExists(authHeader);
            if (!isUser) {
                Http.emit(res, 401, null, "Bearer token failed verification. Not user");
                return false;
            }

            if (isUser.pass == authBearer) {
                return next();
            } else {
                Http.emit(res, 401, null, "Bearer token failed verification. Not equal");
                return false;
            }


        } catch(err) {
            _error.log("_auth()", `A system-level error occurred while authenticating:>> ${err}`, 5);
            Http.emit(res, 500, null, "An internal error occurred. Contact the site administrator.");
            return;
        }

            /*
            const authHeader = req.headers.bearer || req.headers.authorization;
            const authBearer = "Bearer";

            if (authHeader == undefined) {
                // Http.emit(res, 401, null, "Authorization header absent in request.");
                Http.emit(res, 401, null, authHeader);
                return;
            }



            const authToken = authHeader.replace(authBearer, "");
            const jwt_secret = process.env.JWT_SECRET || "";

            const verifiedJwt = jwt.verify(authToken, jwt_secret);
            const user = await User_model.find("user_id", verifiedJwt);

            if (!user || user.length < 1) {
                Http.emit(res, 401, null, "Invalid Authorization header in request.");
            }// } else {
                console.log("======================")
                next();
            // }

        } catch(err) {
            // Http.emit(res, 500, null, "The server attempted to handle this request but an error occurred");
            // console.log(err)
            next();
            return;
        }
        */
    }
}

module.exports = auth;