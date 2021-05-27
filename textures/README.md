# Textures

## Convert to WebP

You'll need the `cwebp` binary. See https://developers.google.com/speed/webp/download. On Ubuntu, install the `webp` package.

    $ sudo apt install webp

Convert all PNGs (losslessly) and JPGs (lossily) into WebP by running:

    $ make

If you're in the repo root, you can run this instead:

    $ make -C textures

## Normal Maps

Some texture catalogues, like CC0Textures, save their normal maps in the [DirectX-compatible format](https://help.ambientcg.com/02-Using%20the%20assets/Normal_map_styles.html).

You can convert them into the OpenGL-compatible format by running the following [ImageMagick](https://imagemagick.org/index.php) command:

    $ mogrify -channel g -negate +channel ./Sponge001_1K_Normal.jpg

## License 

Contains assets from [CC0Textures.com](https://cc0textures.com), licensed under CC0 1.0 Universal.
