const multer = require( 'multer' )

module.exports = ( req, res, next ) =>
{
    const uuid = req.current_user.uuid
    const user_dir = ( process.cwd() + '/users/' + uuid ).replaceAll( "\\", "/" )

    const storage = multer.diskStorage( {
        destination: ( req, file, cb ) => cb( null, user_dir ),
        filename: ( req, file, cb ) => cb( null, file.originalname )
    } )


    const handle_file = multer( { storage: storage } ).single( 'blendfile' )

    handle_file( req, res, ( error ) =>
    {
        if ( error ) return res.json( { status: 500 } )
        res.json( { status: 200 } )
        console.log( `Succesful file upload by user: ${uuid}, filename: ${req.file.originalname}` )
    } )
}