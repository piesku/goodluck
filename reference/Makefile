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

COMMON := \
	common_aabb.html \
	common_aabb2d.html \
	common_audio.html \
	common_color.html \
	common_easing.html \
	common_framebuffer.html \
	common_game.html \
	common_html.html \
	common_input.html \
	common_load.html \
	common_mat2d.html \
	common_mat4.html \
	common_material.html \
	common_math.html \
	common_mesh.html \
	common_navmesh.html \
	common_number.html \
	common_pathfind.html \
	common_projection.html \
	common_projection2d.html \
	common_quat.html \
	common_random.html \
	common_raycast.html \
	common_texture.html \
	common_vec2.html \
	common_vec3.html \
	common_vec4.html \
	common_webgl.html \
	common_world.html

all: index.html $(COMPONENTS) $(SYSTEMS) $(COMMON)

index.html: Makefile generate_index.mjs $(COMPONENTS) $(SYSTEMS) $(COMMON)
	node generate_index.mjs \
		$(COMPONENTS:com_%.html=--component com_%.html) \
		$(SYSTEMS:sys_%.html=--system sys_%.html) \
		$(COMMON:common_%.html=--common common_%.html) \
		> $@

com_%.html: ../core/components/com_%.ts generate_reference.mjs
	node generate_reference.mjs $< \
		$(COMPONENTS:com_%.html=--component com_%.html) \
		$(SYSTEMS:sys_%.html=--system sys_%.html) \
		$(COMMON:common_%.html=--common common_%.html) \
		> $@

sys_%.html: ../core/systems/sys_%.ts generate_reference.mjs
	node generate_reference.mjs $< \
		$(COMPONENTS:com_%.html=--component com_%.html) \
		$(SYSTEMS:sys_%.html=--system sys_%.html) \
		$(COMMON:common_%.html=--common common_%.html) \
		> $@

common_%.html: ../common/%.ts generate_reference.mjs
	node generate_reference.mjs $< \
		$(COMPONENTS:com_%.html=--component com_%.html) \
		$(SYSTEMS:sys_%.html=--system sys_%.html) \
		$(COMMON:common_%.html=--common common_%.html) \
		> $@

.PHONY: clean
clean:
	rm -f index.html
	rm -f com_*.html
	rm -f sys_*.html
	rm -f common_*.html
