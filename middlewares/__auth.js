const HttpClass = require("../utils/Http.class");
const jwt = require("jsonwebtoken");
const User_model = require("../models/User_model");

function auth() {
    return async function (req, res, next) {
        const Http = new HttpClass();
        try {
            const authHeader = req.headers.authorization;
            const authBearer = "Bearer ";

            if (!authHeader || !authHeader.startsWith(authBearer)) {
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
    }
}

module.exports = auth;