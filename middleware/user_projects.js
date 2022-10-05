const Blender = require( '../api/blender' )
const fs = require( 'fs' )

module.exports = ( req, res, next ) =>
{
    const uuid = req.current_user.uuid
    const user_dir = ( process.cwd() + '/users/' + uuid ).replaceAll( "\\", "/" )
    if ( !fs.existsSync( user_dir ) ) fs.mkdirSync( user_dir )

    const files = fs.readdirSync( user_dir ).filter( file => file.substring( file.length - 5 ).toLowerCase() == 'blend' )

    const project_files = []

    async function compose_file_data( files_array )
    {
        for ( const file of files_array )
        {
            const file_header = await Blender.parse_blend_file_header( user_dir + '/' + file )
            const stats = fs.statSync( user_dir + '/' + file )
            project_files.push( {
                filename: file,
                version: `${file_header.version.substring( 0, 1 )}.${file_header.version.substring( 1, 3 )}`,
                size: ( stats.size > 1000000 ) ? ( stats.size / 1024 / 1024 ).toFixed( 1 ) + " MB" : ( stats.size / 1024 ).toFixed( 0 ) + " kB"
            } )
        }
        res.json( {
            status: 200,
            project_files: project_files,
            blender_versions: req.blender_versions,
            is_admin: req.current_user.permissions 
        } )
    }

    compose_file_data( files )

}