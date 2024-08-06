import jwt from "jsonwebtoken";
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'No token provided.' });

    const secretkey = process.env.JWT_SECRET;
    jwt.verify(token, secretkey, (err, decoded) => {
        if (err) return res.status(500).json({ message: 'Failed to authenticate token.' });
        req.userId = decoded.userId;
        next();
    });
};

export default verifyToken;