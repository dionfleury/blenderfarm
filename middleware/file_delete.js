const fs = require( 'fs' )

module.exports = ( req, res, next ) =>
{
    const uuid = req.current_user.uuid
    const user_dir = ( process.cwd() + '/users/' + uuid ).replaceAll( "\\", "/" )

    fs.unlink( `${user_dir}/${req.body.file}`, error =>
    {
        if ( error ) return res.json( { status: 500 } )
        fs.rmdirSync( `${user_dir}/${req.body.file}_renders`, { recursive: true, force: true } )
        fs.unlink( `${user_dir}/${req.body.file}1`, error => console.log( error ) ) // FIX THIS for ENOENT
        res.json( { status: 200 } )
    } )

    console.log( `Succesful DELETE request from user: ${uuid}, filename: ${req.body.file}` )
}