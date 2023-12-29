const jwt=require("jsonwebtoken")
const verifyUser = (req, res, next) => {0
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Error: "You are not Authenticated" });
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) return res.json({ Error: "Token wrong" });
            req.email = decoded.email;
            req.id=decoded.id

            next();
        })
    }
}
module.exports= verifyUser