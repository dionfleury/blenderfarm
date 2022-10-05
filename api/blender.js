const { spawn } = require( 'child_process' )
const fs = require( 'fs' )

class Blender
{
    constructor( version, exe_path )
    {
        this.version = version
        this.exe_path = exe_path
    }

    render( cwd, args, socket )
    {
        return new Promise( ( resolve, reject ) =>
        {
            const mode = ( args.indexOf( "-f" ) == -1 ) ? 1 : 0
            const render_process = spawn( this.exe_path, args, { cwd } )

            let detected_version = {}

            let start_frame, end_frame
            if ( mode == 1 )
            {
                start_frame = args[ args.indexOf( "-s" ) + 1 ]
                end_frame = args[ args.indexOf( "-e" ) + 1 ]
            }


            render_process.on( "exit", ( code, signal ) =>
            {
                if ( code === 0 ) resolve()
                else
                {
                    console.log( `Render Process exited with code ${code} and signal ${signal}` )
                    reject()
                }
            } )

            if ( socket != null ) render_process.stdout.on( 'data', data =>
            {
                let message = data.toString()
                // Detect version
                if ( message.search( /Blender \d+\.\d+\.\d+/ ) > -1 )
                {
                    const version = message.match( /Blender (\d+\.\d+\.\d+)/ )[ 1 ].split( "." )
                    detected_version.major = version[ 0 ]
                    detected_version.minor = version[ 1 ]
                    detected_version.patch = version[ 2 ]
                }
                // Scrub privacy-sensitive information
                message = message.replace( /Read prefs:.*userpref.blend/, "" )
                message = message.replace( /Read blend:.*blenderfarm/, "Read blend:" )
                message = message.replace( /Saved:.*blenderfarm/, "Saved: '" )
                // Report Progress
                if ( mode == 0 )
                {
                    let samples_status

                    if ( detected_version?.major < 3 && message.search( /\d+\/\d+ Tiles/ ) > -1 ) samples_status = message.match( /(\d+\/\d+) Tiles/ )[ 1 ].split( "/" )
                    else if ( message.search( /Sample \d+\/\d+/ ) > -1 ) samples_status = message.match( /Sample (\d+\/\d+)/ )[ 1 ].split( "/" )

                    if ( samples_status != null )
                    {
                        const progress = samples_status[ 0 ] / samples_status[ 1 ] * 100
                        socket.emit( "progress", progress )
                    }
                }
                if ( mode == 1 && message.search( /Finished/ ) > -1 )
                {
                    const current_frame = message.match( /Fra:(\d+)/ )[ 1 ]
                    socket.emit( "progress", ( ( current_frame - start_frame ) / end_frame ) * 100 )
                }
                socket.emit( "console", message )
            } )
        } )

    }


    static parse_blend_file_header( file_path )
    {
        return new Promise( ( resolve, reject ) =>
        {
            fs.open( file_path, ( err_op, fd ) =>
            {
                if ( err_op ) reject( err_op )
                fs.read( fd, Buffer.alloc( 12 ), 0, 12, 0, ( err_rd, bytes_read, buffer ) =>
                {
                    if ( err_rd ) reject( err_rd )
                    const header = {}
                    header.magic = buffer.subarray( 0, 7 ).toString( 'utf8' )
                    header.ptr_size_bytes = ( buffer.readUint8( 7 ) == 45 ) ? 8 : 4
                    header.endianness = ( buffer.readUInt8( 8 ) == 118 ) ? 'little' : 'big'
                    header.version = buffer.subarray( 9, 12 ).toString( 'ascii' )
                    fs.close( fd, () => resolve( header ) )
                } )
            } )
        } )

    }
}




module.exports = Blender