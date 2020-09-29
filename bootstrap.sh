#!/bin/bash

while read link; do
    echo "Symlink found: $link"
    real=$(readlink "$link")
    pushd $(dirname "$link") > /dev/null
    rm $(basename $link)
    cp $real .
    popd > /dev/null
    echo "  replaced by: $real"
done < <(find $1 -type l)
