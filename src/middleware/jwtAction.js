require("dotenv").config();
const jwt = require("jsonwebtoken");
const db = require("../models");
const nonSecurePaths = ["/logout", "/login", "/register", "/auth/google", "/auth/google/callback"];

const createJWT = (payload, time) => {
    let key = process.env.JWT_SECRET;
    let token = null;
    try {
        token = jwt.sign(payload, key, { expiresIn: time });
    } catch (err) {
        console.log(err);
    }

    return token;
};

const verifyToken = (token) => {
    let key = process.env.JWT_SECRET;
    let decoded = null;
    try {
        decoded = jwt.verify(token, key);
        data = decoded;
    } catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
            return "JsonWebTokenError";
        }
        console.log(err);
    }
    return decoded;
};

const extractToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
        return req.headers.authorization.split(" ")[1];
    }
};
const checkUserJWT = async (req, res, next) => {
    if (nonSecurePaths.includes(req.path)) return next();

    const cookies = req.cookies;
    const tokenFromHeader = extractToken(req);
    const accessToken = cookies?.access_token || tokenFromHeader;

    if (accessToken) {
        let decoded = verifyToken(accessToken);

        if (decoded && decoded !== "JsonWebTokenError") {
            req.user = decoded;
            return next();
        }
    }

    // Handle refresh token logic
    if (cookies.refresh_token) {
        decoded = verifyToken(cookies.refresh_token);

        if (decoded && decoded !== "JsonWebTokenError") {
            const payload = {
                id: +decoded.id,
                email: decoded.email,
                role: decoded.role,
            };
            const newAccessToken = createJWT(payload, process.env.JWT_ACCESS_TOKEN_EXIRES_IN);
            const newRefreshToken = createJWT(payload, process.env.JWT_REFRESH_TOKEN_EXIRES_IN);

            res.cookie("access_token", newAccessToken, {
                httpOnly: true,
                maxAge: +process.env.MAX_AGE_ACCESS_TOKEN,
            });
            res.cookie("refresh_token", newRefreshToken, {
                httpOnly: true,
                maxAge: +process.env.MAX_AGE_REFRESH_TOKEN,
            });

            await db.Account.update({ refreshToken: newRefreshToken }, { where: { id: decoded.id } });

            return res.status(405).json({
                EC: -1,
                EM: "Please retry with a new token.",
                DT: "",
            });
        }
    }

    return res.status(401).json({
        EC: -1,
        EM: "Not authenticated the user",
        DT: "",
    });
};

const checkUserPermission = (req, res, next) => {
    if (nonSecurePaths.includes(req.path)) return next();
    if (req.user) {
        let role = req.user.role;
        let method = req.method;
        let url = req.path;

        const patientRole = [
            { method: "GET", url: "/relative/all" },
            { method: "POST", url: "/patient/quick-check-up" },
            { method: "PUT", url: "/patient/information" },
            { method: "POST", url: "/patient/appointment" },
            { method: "GET", url: "/patient/medical-record/all" },
            { method: "GET", url: "/patient/medical-record/all" },
            { method: "GET", url: "/medical-staff" },
            { method: "GET", url: "/admin/list-of-famous-doctors" },
            { method: "GET", url: "/admin/all-doctor-specialty-by-id" },
            { method: "GET", url: "/doctor/schedule/all" },
            { method: "GET", url: "/admin/specialty/all" },
        ];
        const staffRole = [
            { method: "GET", url: "/appointment/all" },
            { method: "DELETE", url: /^\/staff\/appointment\/\d+$/ },
            { method: "PUT", url: "/staff/appointment" },
            { method: "GET", url: "/medical-staff" },
        ];
        const doctorRole = [
            { method: "GET", url: "/appointment/all" },
            { method: "GET", url: "/doctor/schedule/all" },
            { method: "GET", url: "/admin/time/all" },
            { method: "POST", url: "/doctor/schedule" },
            { method: "DELETE", url: /^\/doctor\/schedule\/\d+$/ },
            { method: "GET", url: "/doctor/appointment-from-one-doctor/all" },
            { method: "PUT", url: "/doctor/examining-doctor" },
            { method: "POST", url: "/doctor/prescription" },
            { method: "POST", url: "/doctor/send-email-invoice" },
            { method: "GET", url: "/doctor/invoice" },
            { method: "GET", url: "/medical-staff" },
            { method: "PUT", url: "/medical-staff" },
            { method: "GET", url: "/admin/medication/all" },
        ];
        const adminRole = [
            { method: "GET", url: "/admin/medical-staff/all" },
            { method: "GET", url: "/admin/time/all" },
            { method: "GET", url: "/admin/position/all" },
            { method: "GET", url: "/medical-staff" },
            { method: "GET", url: "/admin/specialty/all" },
            { method: "POST", url: "/admin/specialty" },
            { method: "PUT", url: "/admin/specialty" },
            { method: "GET", url: "/admin/medication/all" },
            { method: "POST", url: "/admin/medication" },
            { method: "PUT", url: "/admin/medication" },
            { method: "GET", url: "/admin/list-of-famous-doctors" },
            { method: "GET", url: "/admin/all-doctor-specialty-by-id" },
        ];
        if (!role || role.length === 0) {
            return res.status(403).json({
                EC: -1,
                EM: `you don't have the permission to access this resource...`,
                DT: "",
            });
        }
        const roleAccess = {
            "Bệnh nhân": patientRole,
            "Nhân viên": staffRole,
            "Bác sĩ": doctorRole,
            "Quản trị viên": adminRole,
        };

        function checkAccess(role, method, url) {
            return roleAccess[role]?.some((role) => role.method === method && isMatch(url, role.url));
        }

        if (checkAccess(role, method, url)) {
            next();
        } else {
            return res.status(403).json({
                EC: -1,
                EM: `you don't have the permission to access this resource...`,
                DT: "",
            });
        }
    } else {
        return res.status(401).json({
            EC: -1,
            EM: "Not authenticated the user",
            DT: "",
        });
    }
};
function isMatch(url, pattern) {
    if (pattern instanceof RegExp) {
        return pattern.test(url);
    } else if (typeof pattern === "string") {
        return url === pattern;
    } else {
        throw new Error("Pattern must be a string or RegExp");
    }
}
module.exports = {
    createJWT,
    verifyToken,
    checkUserJWT,
    checkUserPermission,
    extractToken,
};
