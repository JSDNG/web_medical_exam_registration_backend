require("dotenv").config();
const jwt = require("jsonwebtoken");

const nonSecurePaths = ["/logout", "/login", "/register", "/auth/google", "/auth/google/callback"];

const createJWT = (payload) => {
    let key = process.env.JWT_SECRET;
    let token = null;
    try {
        token = jwt.sign(payload, key, { expiresIn: process.env.JWT_EXIRES_IN });
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
        console.log(err);
    }
    return decoded;
};

const extractToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
        return req.headers.authorization.split(" ")[1];
    }
};
const checkUserJWT = (req, res, next) => {
    if (nonSecurePaths.includes(req.path)) return next();

    let cookies = req.cookies;
    let tokenFromHeader = extractToken(req);
    if ((cookies && cookies.jwt) || tokenFromHeader) {
        let token = cookies && cookies.jwt ? cookies.jwt : tokenFromHeader;
        let decoded = verifyToken(token);
        if (decoded) {
            req.user = decoded;
            next();
        } else {
            return res.status(401).json({
                EC: -1,
                EM: "Not authenticated the user",
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

const checkUserPermission = (req, res, next) => {
    if (nonSecurePaths.includes(req.path)) return next();
    if (req.user) {
        console.log(req.path);
        let role = req.user.role;
        let method = req.method;
        let url = req.path;
        let id = req.user.id;
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
