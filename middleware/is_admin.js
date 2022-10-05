module.exports = ( req, res, next ) =>
{
    if ( req.current_user.permissions > 0 ) next()
    else res.status( 401 ).redirect( '/' )
}