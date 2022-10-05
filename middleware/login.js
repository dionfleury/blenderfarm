const jwt = require( 'jsonwebtoken' )


module.exports = ( req, res ) =>
{
    try
    {
        const registered_users = req.config.users
        const username = req.body.username.toLowerCase()
        const password = req.body.password

        const user = registered_users.filter( entry => entry.username === username.toLowerCase() )[ 0 ]
        if ( user != null && user.password === password )
        {
            const token = jwt.sign( { username }, req.config.global.JWT_SECRET )
            return res.cookie( "authentication", token, { httpOnly: true } ).redirect( '/' )
        }
        else throw 'Invalid login'
    } catch { res.redirect( '/login' ) }

}