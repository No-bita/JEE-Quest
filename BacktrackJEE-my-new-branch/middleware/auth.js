import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN format

  if (!token) {
    return res.status(401).json({ 
      error: "Access denied"
    });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user info to request object
    req.user = {
      id: decoded.userId,
      name: decoded.userName,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(403).json({ 
      error: "Access denied"
    });
  }
}; 