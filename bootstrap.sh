#!/bin/bash

EXAMPLE=${1%/}

if [ ! -d "$EXAMPLE" ]; then
    echo "Bootstrap a new project from an example."
    echo "    $0 DIRECTORY"
    echo "Example:"
    echo "    $0 NewProject3D"
    exit 1
fi

echo "Bootstrapping $EXAMPLE into src"

echo "  Removing other examples"
while read dir; do
    if [ "$dir" == "$EXAMPLE/" ]; then
        continue
    fi
    echo "    removing $dir"
    rm -rf "$dir"
done < <(ls -1d */ | grep "^[A-Z]")

echo "  Replacing symlinks by the originals from core"
while read link; do
    echo "    symlink found: $link"
    real=$(readlink "$link")
    pushd $(dirname "$link") > /dev/null
    rm $(basename $link)
    cp $real .
    popd > /dev/null
    echo "      replaced by: $real"
done < <(find $EXAMPLE -type l)

echo "  Removing core"
rm -rf core

echo "  Renaming $EXAMPLE to src"
rm -rf src
mv "$EXAMPLE" src

echo "  Updating README"
cat << 'EOF' > README.md
# New Project

This project is based on [Goodluck](https://github.com/piesku/goodluck), a hackable template for creating small and fast browser games.

## Running Locally

To run locally, install the dependencies and start the local dev server:

    npm install
    npm start

Then, open http://localhost:1234 in the browser.

In VS Code, Ctrl+Shift+B will show the available build tasks, including `npm start`, and F5 will open the browser.

## Building

To produce the optimized build, use the `Makefile` in `play/`.

    make -C play

The default target will create a single HTML file, `play/index.html`, will all resources inlined.

If you have the 7-Zip command line utility installed (`p7zip-full` on Ubuntu), you can build the ZIP file by running:

    make -C play index.zip

EOF

echo "  Removing other files"
echo "    removing CHANGELOG"
rm CHANGELOG.md
echo "    removing ${0#./}"
rm $0

echo "  Committing to git"
git add .
git commit -m "Bootstrap src from $EXAMPLE" --quiet

echo "Done."
