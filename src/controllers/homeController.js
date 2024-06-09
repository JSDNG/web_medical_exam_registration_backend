//const { getAll } = require("../services/web");

const getHomePage = async (req, res) => {
    // Cookies that have not been signed
    //console.log("Cookies: ", req.cookies);
    // Cookies that have been signed
    //console.log("Signed Cookies: ", req.signedCookies);
    //let listAccount = await getAll();
    return res.render("home.ejs");
};

module.exports = {
    getHomePage,
};
