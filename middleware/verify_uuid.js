module.exports = ( req, res, next ) =>
{
    if ( req.params.uuid === req.current_user.uuid ) next()
    else res.status( 403 ).sendFile( 'client/403.html', { root: '.' } )
}