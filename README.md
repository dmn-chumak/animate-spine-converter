# Animate-Spine Converter

A simple JSFL script that converts basic Adobe Animate (Adobe Flash) animations to the Spine format.

## Supported Features

- supports v3.8.99, v4.0.64 and v.4.1.19 formats;
- auto-export shapes, text fields and bitmaps;
- auto-merge simple MovieClips into a single Spine slot;
- auto-cleanup unnecessary keyframes to reduce output size;
- basic shape masks (rectangles, circles, polygons);
- blend modes (normal, add, multiply, screen);
- basic bitmap sequence animations (each bitmap should have the same width/height);
- basic transform animations (position, scale, skew, rotation);
- basic color effects parsing and animating (tint, brightness, etc);
- basic transparency animation;
- split timeline into multiple animations.

## Installation

- download **output/converter.jsfl** file;
- open project with animation in Adobe Animate;
- select MovieClips that should be converted to Spine;
- open Commands > "Run Command..." and select downloaded **converter.jsfl** file;
- wait until converter finish exporting;
- **converted files will be located near the project file**;
- open new project in Spine;
- open Spine > "Import Data..." and select converted **.json** file;
- **animation will be imported to Spine project**.

## Development

- run **npm install** to install all packages;
- open **source/index.ts** file to change converter configuration;
- run **npm run compile** to re-build **output/converter.jsfl** file.

## Configuration

- outputFormat;
- imagesExportPath;
- appendSkeletonToImagesPath;
- transformRootBone;
- exportShapes;
- exportTextAsShapes;
- shapeExportScale;
- mergeShapes;
- exportImages;
- mergeImages.

## License Notice

This project is designed to simplify migration from Adobe Animate to Spine software.
By using this project, you confirm, you have valid licenses for both Adobe Animate and Spine software.
