# Assets

This directory contains asset files which require further preprocessing to be
usable in GoodLuck.

## *.blend

The Blender files must be exported to OBJ files via Blender's built-in
exporter. The following are recommended:

| Include                |     |
| -----------------------|-----|
| Selection Only         | Off |
| Objects as OBJ Objects | Off |
| Objects as OBJ Groups  | Off |
| Material Groups        | Off |
| Animation              | Off |

| Transform |            |
| ----------|-----------:|
| Scale     |       1.00 |
| Path Mode |       Auto |
| Forward   | -Z Forward |
| Up        |       Y Up |

| Geometry              |             |
| ----------------------|------------:|
| Apply Modifiers       |          On |
| Smooth Groups         |         Off |
| Bitflag Smooth Groups |         Off |
| Write Normals         | Your Choice |
| Include UVs           | Your Choice |
| Write Materials       |         Off |
| Triangulate Faces     |          On |
| Curves as NURBS       |         Off |
| Polygroups            |         Off |
| Keep Vertex Order     |         Off |
