// TODO-temp authMiddleware
const authMiddleware = async (req, res, next) => {
    console.log("Auth Middleware Hit");

    // Skipping token check to always proceed
    const { token } = req.headers;

    if (!token) {
        console.log("No token provided, but allowing access");
        req.body.userId = "66f298c0d55b83bfb172a269"; //TODO Assign a default userId or skip this if not needed
        return next(); // Allow the request to proceed
    }

    try {
        console.log("Token provided, bypassing check");
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decode?.id || "defaultUserId"; // Default userId if token fails
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.log("Error during token verification, but allowing access");
        req.body.userId = "defaultUserId"; // In case of an error, assign a default userId
        next(); // Allow the request to proceed despite the error
    }
}

module.exports = authMiddleware;