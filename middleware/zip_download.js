const fs = require( 'fs' )
const AdmZip = require( 'adm-zip' )

module.exports = ( req, res, next ) =>
{
    const uuid = req.current_user.uuid
    const user_dir = ( process.cwd() + '/users/' + uuid ).replaceAll( "\\", "/" )

    const project_dir = `${user_dir}/${req.params.project}.blend_renders`
    const files = fs.readdirSync( project_dir )

    console.log( `Preparing to zip ${files.length} files into ${req.params.project}.zip for user ${uuid}` )
    const start_time = performance.now()
    const zip = new AdmZip()
    for ( const file of files ) zip.addLocalFile( `${project_dir}/${file}` )


    const data = zip.toBuffer()

    res.set( 'Content-Type', 'application/octet-stream' )
    res.set( 'Access-Control-Expose-Headers', 'Content-Disposition' )
    res.set( 'Content-Disposition', `attachment; filename=${req.params.project}.zip` )
    res.set( 'Content-Length', data.length )
    res.send( data )

    const end_time = performance.now()
    console.log( `Sent zip file, time taken: ${(end_time - start_time).toFixed(0)} ms` )

}