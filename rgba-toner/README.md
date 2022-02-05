# RGBA-by

Video and Image filter and color editing with Instagram-Inspired image filters

# Install

```bash
yarn add @kabeersnetwork/rgba-by
# or
npm install @kabeersnetwork/rgba-by
```

# Example

## On existing canvas

```js
import { clarendon, applyPresetOnCanvas } from '@kabeersnetwork/rgba-by';

const canvas = document.querySelector('#myCanvas');
applyPresetOnCanvas(canvas, clarendon());
```

## On existing image

```js
import { clarendon, applyPresetOnImage } from '@kabeersnetwork/rgba-by';

const image = document.querySelector('#myImage');
// Function `applyPresetOnImage` is returning a Blob
const blob = applyPresetOnImage(image, clarendon());

image.src = window.URL.createObjectURL(blob);
```

## From URL

```js
import { clarendon, applyPresetOnImageURL } from '@kabeersnetwork/rgba-by';
import myImage from './image.jpg';

// Function `applyPresetOnImage` is returning a Blob
const blob = applyPresetOnImage(myImage, clarendon());

const image = document.querySelector('#myImage');
image.src = window.URL.createObjectURL(blob);
```

## Using preset of filters manually

```js
import { clarendon } from '@kabeersnetwork/rgba-by';

const canvas = document.querySelector('#myCanvas');
const context = canvas.getContext('2d');
// Retrieve canvas pixels
const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
// Transform canvas pixels with the "clarendon" filter
const filteredPixels = clarendon()(pixels);

// Replace pixels on the canvas
context.putImageData(filteredPixels, 0, 0);
```

# Available presets

- Clarendon
- Gingham
- Moon
- Lark
- Reyes
- Juno
- Slumber
- Crema
- Ludwig
- Aden
- Perpetua
- Amaro
- Mayfair
- Rise
- Hudson
- Valencia
- X-Pro II
- Sierra
- Willow
- Lo-Fi
- Inkwell
- Hefe
- Nashville
- Stinson
- Vesper
- Earlybird
- Brannan
- Sutro
- Toaster
- Walden
- 1977
- Kelvin
- Maven
- Ginza
- Skyline
- Dogpatch
- Brooklyn
- Helena
- Ashby
- Charmes

## Mapping

A mapping of `filter name` -> `filter function` is exported as `presetsMapping`:

```js
import { presetsMapping } from '@kabeersnetwork/rgba-by';
```

# Raw filters

You can also use the raw filters directly like this:

```js
import { sepia } from '@kabeersnetwork/rgba-by/lib/filters';

...

// Apply only sepia filter with a value of 0.5
const filteredPixels = sepia(0.5)(pixels);

...
```

## Available filters

- grayscale
- sepia
- brightness
- saturation
- contrast
- rgbAdjust
- colorFilter

# More Documentation

For more docs and articles about this and much more stuff head on to
https://developers.kabeersnetwork.tk

# Credits

Filters data are coming from [filterous-2](https://github.com/girliemac/filterous-2).

Special Thanks to Noe Lebrun https://gitlab.com/lebrun.noe

Copyright (c) Kabeer's Network LLC
