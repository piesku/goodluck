import bpy
import sys

# get all args after "--"
argv = sys.argv[sys.argv.index("--") + 1:]
bpy.ops.export_scene.obj(
    filepath=argv[0],
    check_existing=False,
    axis_forward="-Z",
    axis_up="Y",
    use_materials=False)
