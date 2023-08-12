COMPONENTS := \
	com_animate_sprite.html \
	com_animate.html \
	com_audio_listener.html \
	com_audio_source.html \
	com_callback.html \
	com_camera.html \
	com_camera2d.html \
	com_children.html \
	com_collide.html \
	com_collide2d.html \
	com_control_always.html \
	com_control_always2d.html \
	com_control_player.html \
	com_disable.html \
	com_draw.html \
	com_emit_particles.html \
	com_follow.html \
	com_lifespan.html \
	com_light.html \
	com_local_transform2d.html \
	com_look_at.html \
	com_mimic.html \
	com_move.html \
	com_move2d.html \
	com_named.html \
	com_render.html \
	com_render2d.html \
	com_rigid_body.html \
	com_rigid_body2d.html \
	com_shake.html \
	com_spatial_node2d.html \
	com_spawn.html \
	com_task.html \
	com_toggle.html \
	com_transform.html \
	com_trigger.html

SYSTEMS := \
	sys_animate.html \
	sys_audio_listener.html \
	sys_audio_source.html \
	sys_camera_xr.html \
	sys_camera.html \
	sys_camera2d.html \
	sys_collide.html \
	sys_collide2d.html \
	sys_control_always.html \
	sys_control_always2d.html \
	sys_control_keyboard.html \
	sys_control_mouse_drag.html \
	sys_control_mouse_move.html \
	sys_control_touch_drag.html \
	sys_control_touch_move.html \
	sys_control_xbox.html \
	sys_debug.html \
	sys_draw.html \
	sys_draw2d.html \
	sys_follow.html \
	sys_lifespan.html \
	sys_light.html \
	sys_look_at.html \
	sys_mimic.html \
	sys_move.html \
	sys_move2d.html \
	sys_particles.html \
	sys_physics_integrate.html \
	sys_physics_kinematic.html \
	sys_physics_resolve.html \
	sys_physics2d_integrate.html \
	sys_physics2d_resolve.html \
	sys_poll.html \
	sys_render_deferred.html \
	sys_render_depth.html \
	sys_render_forward.html \
	sys_render_shading.html \
	sys_render_xr.html \
	sys_render2d_animate.html \
	sys_render2d.html \
	sys_resize.html \
	sys_resize2d.html \
	sys_shake.html \
	sys_shake2d.html \
	sys_spawn.html \
	sys_spawn2d.html \
	sys_toggle.html \
	sys_transform.html \
	sys_transform2d.html \
	sys_trigger.html \
	sys_trigger2d.html \
	sys_ui.html

LIBRARIES := \
	lib_aabb.html \
	lib_aabb2d.html \
	lib_audio.html \
	lib_color.html \
	lib_easing.html \
	lib_framebuffer.html \
	lib_game.html \
	lib_html.html \
	lib_input.html \
	lib_load.html \
	lib_mat2d.html \
	lib_mat4.html \
	lib_material.html \
	lib_math.html \
	lib_mesh.html \
	lib_navmesh.html \
	lib_number.html \
	lib_pathfind.html \
	lib_projection.html \
	lib_projection2d.html \
	lib_quat.html \
	lib_random.html \
	lib_raycast.html \
	lib_texture.html \
	lib_vec2.html \
	lib_vec3.html \
	lib_vec4.html \
	lib_webgl.html \
	lib_world.html

UTILITIES := \
	tiled_tmj2map.html \
	tiled_tsj2atlas.html

all: index.html $(COMPONENTS) $(SYSTEMS) $(LIBRARIES) $(UTILITIES)

index.html: Makefile generate_index.mjs $(COMPONENTS) $(SYSTEMS) $(LIBRARIES) $(UTILITIES)
	node generate_index.mjs \
		$(COMPONENTS:com_%.html=--component com_%.html) \
		$(SYSTEMS:sys_%.html=--system sys_%.html) \
		$(LIBRARIES:lib_%.html=--library lib_%.html) \
		$(UTILITIES:%.html=--utility %.html) \
		> $@

com_%.html: ../core/components/com_%.ts generate_reference.mjs
	node generate_reference.mjs $< \
		$(COMPONENTS:com_%.html=--component com_%.html) \
		$(SYSTEMS:sys_%.html=--system sys_%.html) \
		$(LIBRARIES:lib_%.html=--library lib_%.html) \
		$(UTILITIES:%.html=--utility %.html) \
		> $@

sys_%.html: ../core/systems/sys_%.ts generate_reference.mjs
	node generate_reference.mjs $< \
		$(COMPONENTS:com_%.html=--component com_%.html) \
		$(SYSTEMS:sys_%.html=--system sys_%.html) \
		$(LIBRARIES:lib_%.html=--library lib_%.html) \
		$(UTILITIES:%.html=--utility %.html) \
		> $@

lib_%.html: ../lib/%.ts generate_reference.mjs
	node generate_reference.mjs $< \
		$(COMPONENTS:com_%.html=--component com_%.html) \
		$(SYSTEMS:sys_%.html=--system sys_%.html) \
		$(LIBRARIES:lib_%.html=--library lib_%.html) \
		$(UTILITIES:%.html=--utility %.html) \
		> $@

$(UTILITIES): %.html: ../util/%.cjs generate_reference.mjs
	node generate_reference.mjs $< \
		$(COMPONENTS:com_%.html=--component com_%.html) \
		$(SYSTEMS:sys_%.html=--system sys_%.html) \
		$(LIBRARIES:lib_%.html=--library lib_%.html) \
		$(UTILITIES:%.html=--utility %.html) \
		> $@

.PHONY: clean
clean:
	rm -f *.html
