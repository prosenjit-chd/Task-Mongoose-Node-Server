const test = async (req, res, next) => {
    console.log("This is form middleware");
    next();
}

module.exports = test;