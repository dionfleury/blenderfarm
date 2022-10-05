const Blender = require( '../api/blender' )



module.exports = ( req, res, next ) =>
{

    const socket = req.ws_clients.filter( socket => socket.id == req.body.socket_id )[ 0 ]

    socket.emit( "console", "Starting render..." )

    const cwd = ( process.cwd() + `/users/${req.current_user.uuid}/` ).replaceAll( "\\", "/" )
    const blender = req.blender_instances.filter( instance => instance.version === req.body.version )[ 0 ]
    blender.render( cwd, req.body.args, socket )
        .then( () => res.json( { status: 200, msg: "Render completed successfully" } ) )
        .catch( () => res.json( { status: 500, msg: "Error: Render process crashed" } ) )
        .finally( () => { socket.disconnect( true ) } )

}