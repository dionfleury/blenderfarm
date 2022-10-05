const jwt = require( 'jsonwebtoken' )

module.exports = ( req, res, next ) =>
{
    try
    {
        const decoded_token = jwt.verify( req.cookies.authentication, req.config.global.JWT_SECRET )
        const user = req.config.users.filter( entry => entry.username === decoded_token.username )[ 0 ]
        
        if ( user == null ) throw 'Invalid User ID'
        else
        {
            req.current_user = user
            next()
        }
    } catch { res.status( 401 ).redirect( '/login' ) }
}
