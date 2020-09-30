#!/bin/bash

EXAMPLE=${1%/}

if [ ! -d "$EXAMPLE" ]; then
    echo "Bootstrap a new project from an example."
    echo "    $0 DIRECTORY"
    echo "Example:"
    echo "    $0 FlyCamera"
    exit 1
fi

echo "Bootstrapping $EXAMPLE into src"

echo "  Replacing symlinks by the originals from Abstract"
while read link; do
    echo "    symlink found: $link"
    real=$(readlink "$link")
    pushd $(dirname "$link") > /dev/null
    rm $(basename $link)
    cp $real .
    popd > /dev/null
    echo "      replaced by: $real"
done < <(find $EXAMPLE -type l)

echo "  Removing other examples"
while read dir; do
    if [ "$dir" == "$EXAMPLE/" ]; then
        continue
    fi
    echo "    removing $dir"
    rm -rf "$dir"
done < <(ls -1d */ | grep "^[A-Z]")

echo "  Renaming $EXAMPLE to src"
mv "$EXAMPLE" src

echo "  Committing to git"
git add .
git ci -m "Bootstrap src from $EXAMPLE" --quiet

echo "Done."
