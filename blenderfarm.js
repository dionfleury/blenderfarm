const express = require( 'express' )
const cookie_parser = require( 'cookie-parser' )
const fs = require( 'fs' )
const WSServer = require( "socket.io" ).Server

const Blender = require( './api/blender' )

const app = express()
const server = {}

function load_config() { return JSON.parse( fs.readFileSync( __dirname + "/config.json" ) ) }
server.config = load_config()

function start_server() { server.app = app.listen( server.config.global.PORT, () => console.log( `Listening on localhost port ${server.config.global.PORT}` ) ) }
function stop_server() { server.app.close() }
function restart_server()
{
    server.config = load_config()
    server.available_versions = load_available_versions()
    stop_server()
    start_server()
}
start_server()

const wss = new WSServer( server.app )
server.ws_clients = []
const wss_connection = wss.on( "connection", socket =>
{
    server.ws_clients.push( socket )
    socket.on( "disconnect", () => server.ws_clients = server.ws_clients.filter( item => item !== socket ) )
    socket.emit( "connection_ready" )
} )

function load_available_versions()
{
    const available_versions = []
    for ( const install of server.config.blender_installations ) available_versions.push( new Blender( install.version, install.exe_path ) )
    return available_versions
}
server.available_versions = load_available_versions()

app.use( ( req, res, next ) =>
{
    req.config = server.config
    req.blender_versions = server.available_versions.map( inst => inst.version )
    req.blender_instances = server.available_versions
    req.wss_connection = wss_connection
    req.ws_clients = server.ws_clients
    next()
} )

const mw_authenticate = require( './middleware/authenticate' )
const mw_login = require( './middleware/login' )
const mw_hascookie = require( './middleware/has_cookie' )
const mw_is_admin = require( './middleware/is_admin' )
const mw_user_projects = require( './middleware/user_projects' )
const mw_user_renders = require( './middleware/user_renders' )
const mw_file_upload = require( './middleware/file_upload' )
const mw_file_delete = require( './middleware/file_delete' )
const mw_verify_uuid = require( './middleware/verify_uuid' )
const mw_render_file = require( './middleware/render_file' )
const mw_zip_download = require( './middleware/zip_download' )

app.use( express.json() )
app.use( express.urlencoded( { extended: true } ) )
app.use( cookie_parser() )
app.use( express.static( './assets' ) )
app.use( '/bulma', express.static( './node_modules/bulma/css' ) )
app.use( '/fontawesome', express.static( './node_modules/@fortawesome/fontawesome-free' ) )

app.use( '/users/:uuid', mw_authenticate, mw_verify_uuid )
app.use( '/users/:uuid/:project', ( req, res, next ) => express.static( `./users/${req.params.uuid}/${req.params.project}.blend_renders` )( req, res, next ) )

app.set( 'view engine', 'ejs' )


app.get( '/', mw_authenticate, ( req, res ) => res.sendFile( __dirname + '/client/projects.html' ) )

app.get( '/renders/:project', mw_authenticate, mw_user_renders )

app.get( '/renders/:project/download', mw_authenticate, mw_zip_download )

app.get( '/user_projects', mw_authenticate, mw_user_projects )
app.get( '/user_renders', mw_authenticate, mw_user_renders )

app.get( '/login', mw_hascookie, ( req, res ) => res.sendFile( __dirname + '/client/login.html' ) )
app.post( '/login', mw_login )

app.get( '/admin', mw_authenticate, mw_is_admin, ( req, res ) => { res.sendFile( __dirname + '/client/admin.html' ) } )

app.post( '/file', mw_authenticate, mw_file_upload )
app.delete( '/file', mw_authenticate, mw_file_delete )

app.post( '/render', mw_authenticate, mw_render_file )

app.get( '/config', ( req, res ) => res.json( server.config ) )
app.post( '/config', ( req, res ) =>
{
    fs.writeFileSync( __dirname + '/config.json', JSON.stringify( req.body ) )
    res.json( { msg: "Saved Config, restarting server..." } )
    restart_server()
} )

app.get( '*', ( req, res ) => res.status( 404 ).sendFile( __dirname + '/client/404.html' ) )

