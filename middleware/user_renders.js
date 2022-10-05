const fs = require( 'fs' )

module.exports = ( req, res, next ) =>
{
    const uuid = req.current_user.uuid
    const user_dir = ( process.cwd() + '/users/' + uuid ).replaceAll( "\\", "/" )


    req.ejs_data = {}
    req.ejs_data.project = req.params.project
    req.ejs_data.images = []

    try
    {
        const images = fs.readdirSync( `${user_dir}/${req.params.project}.blend_renders` ) || []
        for ( const image of images )
        {
            const size = fs.statSync( `${user_dir}/${req.params.project}.blend_renders/${image}` ).size
            req.ejs_data.images.push( {
                path: `/users/${uuid}/${req.params.project}/${image}`,
                size: ( size > 1000000 ) ? ( size / 1024 / 1024 ).toFixed( 1 ) + " MB" : ( size / 1024 ).toFixed( 0 ) + " kB"
            } )
        }
        res.render( process.cwd() + '/client/renders.ejs', { data: req.ejs_data } )
    } catch { next() }
}