# Textures

## Convert to WebP

You'll need the `cwebp` binary. See https://developers.google.com/speed/webp/download. On Ubuntu, install the `webp` package.

    $ sudo apt install webp

Convert all PNGs (losslessly) and JPGs (lossily) into WebP by running:

    $ make

If you're in the repo root, you can run this instead:

    $ make -C textures

## Texture Maps

The textures for the mapped material come from [CC0Textures.com](https://cc0textures.com). See https://help.ambientcg.com/02-Using%20the%20assets/The_different_PBR_maps.html for more information about them.


### Normal Maps

CC0Textures save their normal maps in the [DirectX-compatible format](https://help.ambientcg.com/02-Using%20the%20assets/Normal_map_styles.html). You can convert them into the OpenGL-compatible format by running the following [ImageMagick](https://imagemagick.org/index.php) command:

    $ mogrify -channel g -negate +channel ./Sponge001_1K_Normal.jpg

### Roughness Maps

This map describes the roughness of the material. If this image is closer to black that means that the material appears to be very shiny. Consequently an almost white image means that the material has a very diffuse look.

## License 

Contains assets from [CC0Textures.com](https://cc0textures.com), licensed under CC0 1.0 Universal.
