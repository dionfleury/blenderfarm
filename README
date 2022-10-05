# Blenderfarm

An easy way to turn your workstation running [Blender](https://www.blender.org/) into your own personal remote render farm.

> **Warning**
> This project **is not** affiliated with Blender in any way. The Blender name and logo are trademarks of the Blender Foundation. Any use of, or reference to said trademarks in this project is purely for indicative purposes in the sense that this software is intended to be used in conjunction with the Blender product.

## Description

The goal of this project is to provide an easy to set up and easy to use web interface to remotely render scenes made in Blender. The project was originally a proof-of-concept, developed to see what it would take to build some basic renderfarm functionality. As such, the following features are considered part of the minimum viable product and are part of the `α 1.0.0` release:

* login system with session cookies
* upload and management of projects through `.blend` files
* remote rendering with live progress and console feedback
* previewing and download (image or zip) of render results

As of version `α 1.0.0`, the minimum viable product is considered feature-complete, and is therefore ready for publishing, forking, testing, public scrutiny.

This project is mainly aimed at personal use. While it might be enticing, use in a professional setting is not recommended. The main reason being the software is provided AS-IS, and will therefore not be provided support on. It is not advisable to use this software for mission-critical tasks as any occurrence of bugs in this software could have unintended consequences. A lot needs testing and possibly fixing before this can even be considered recommended for professional use.

## Getting Started

### Dependencies

One of the goals of this project is to develop it as lightweight as possible without compromising ease of development too much. Depending on who you ask, this balance should be shifted either way. In this case though, dependencies were mostly chosen based on what felt right.
The following are notable dependencies this project is based on:

| dependency    | version | notes                     |
| ------------- | ------- | ------------------------- |
| Node.js       | 18.8.0  | Lower versions might work |
| express       | 4.18.1  |                           |
| jsonwebtoken  | 8.5.1   | JWT sessions              |
| cookie-parser | 1.4.6   | auth cookie               |
| multer        | 1.4.6   | for file uploads          |
| ejs           | 3.1.8   | added part-way            |
| socket.io     | 4.5.2   | for web-console           |
| bulma         | 0.9.4   | fancy styling             |
| fontawesome   | 6.2.0   | fancy icons               |

And last but not least, Blender!
> **Note**
> Blender is not bundled with this project and should be installed separately. The project is intended to be used as a wrapper for an existing installation of Blender (or multiple installations). Get it at [blender.org](https://blender.org).

This project was developed on blender versions `2.93`, `3.0` `3.2` and `3.3`, and has a fallback for the way tile-based rendering 

### Platform

Blenderfarm **should** be platform-agnostic since most of the internal code revolves around shell-commands through Node.js' `fs` and `child_process` APIs. However it should be stated that this has thus far only been properly tested on a Windows 10-based system. Linux and MacOS **should** work, **might** work, no guarantees. GPU backends other than `OptiX`, which is the default, are available through a source code edit of the `client/projects.html` file.

## How to Use

### Installation Instructions

1. Download the source from this repository
2. Install NPM dependencies
   
   ```
   > npm install
   ```
3. *(optional)* modify `config.json` to change some settings
4. Run the app through Node.js or a process manager like `nodemon`, `forever` or `pm2`
   
   ```
   > node app
   > nodemon app
   > forever app
   > pm2 start app
   ```

5. Visit `http:/localhost:PORT/` in your browser to open the interface

## Rendering
Blenderfarm currently supports a specific subset of the functionality provided by the [Blender Command Line Render Interface](https://docs.blender.org/manual/en/latest/advanced/command_line/render.html). 

The following use cases are supported:

* Render Engines `Cycles` | `Eevee` | `Workbench`
* Image Formats `PNG` | `BMP` | `JPEG` | `TIFF` | `OPEN_EXR`
* GPU Rendering (Cycles), using `OPTIX` by default. `CUDA` , `HIP` , `ONEAPI` and `METAL` possible through edit of `client/projects.html`.
* CPU Rendering (Cycles)
* Hybrid Rendering (Cycles)
* Rendering stills or animations
* Specifying frame to render, or *start* and *end* frames for animations

These are currently **NOT** supported:

* Rendering to video formats
* Jumping frames
* Specifying threads


## To-Do List

These are additions that might be interesting to add in the future, or that might also be interesting for the community to tackle:

- [ ] Writing a more comprehensive user guide with GIFs showing the process of use from start to finish
- [ ] Implement Blender python interface to support configuring output resolution and max samples before render (Either that or (pull-)requesting those features into the Blender CLI)
- [ ] Improving responsiveness of UI for mobile platforms
- [ ] Improving UX and functionality
- [ ] Taking a proper look at security aspects
- [ ] Testing different (earlier) versions of Blender
- [ ] Whole lot of monkey testing
- [ ] ...

And last but not least:
- [ ] Refactoring hacks and bad practices


<!-- TODO -->
<!-- ## User Guide -->


## License

This project is licensed under the GNU GPL v3.0 License - see the LICENSE.md file for details.

This project is provided ​“AS IS”. Other than as provided in this agreement, Developer makes no other warranties, express or implied, and hereby disclaims all implied warranties, including any warranty of merchantability and warranty of fitness for a particular purpose.
