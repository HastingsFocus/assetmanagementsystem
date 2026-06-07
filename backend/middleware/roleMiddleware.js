export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {

        /*
        ==================================
        CHECK IF USER EXISTS (from auth middleware)
        ==================================
        */

        if (!req.user) {
            return res.status(401).json({
                message: "Not authorized"
            });
        }

        /*
        ==================================
        CHECK ROLE PERMISSION
        ==================================
        */

        const userRole = req.user.role;

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                message: `Role ${userRole} is not allowed to access this resource`
            });
        }

        next();
    };
};