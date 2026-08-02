    const jwt = require("jsonwebtoken");

    const adminAuth = (req, res, next) => {

        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Access Denied"
            });
        }

        try {

            const verified = jwt.verify(token, process.env.JWT_SECRET);

            if (verified.role !== "admin") {
                return res.status(403).json({
                    message: "Only Admin can perform this action"
                });
            }

            req.user = verified;

            next();

        } catch (err) {

            res.status(401).json({
                message: "Invalid Token"
            });

        }

    };

    module.exports = adminAuth; 
