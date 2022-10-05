const jwt = require( 'jsonwebtoken' )

module.exports = ( req, res, next ) =>
{
    try
    {
        const decoded_token = jwt.verify( req.cookies.authentication, req.config.global.JWT_SECRET )
        const user = req.config.users.filter( entry => entry.username === decoded_token.username )[ 0 ]
        
        if ( user != null ) res.redirect('/')
        else next()
    } catch { next() }
}
