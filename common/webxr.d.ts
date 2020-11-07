// https://github.com/google/model-viewer/blob/master/packages/model-viewer/src/types/webxr.ts

/* @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

declare type Constructor<T = object> = {
    new (...args: any[]): T;
    prototype: T;
};

declare type XRReferenceSpaceType =
    | "local"
    | "local-floor"
    | "bounded-floor"
    | "unbounded"
    | "viewer";

declare type XRSessionMode = "inline" | "immersive-ar" | "immersive-vr";

declare interface XRPresentationContext {
    readonly canvas: HTMLCanvasElement;
}

declare interface XRHitTestSource {
    cancel(): void;
}

declare interface XRHitTestResult {
    getPose(baseSpace: XRSpace): XRPose | null;
}

declare interface XR extends EventTarget {
    requestSession(mode: XRSessionMode, options?: any): Promise<XRSession>;
    isSessionSupported(mode: XRSessionMode): Promise<boolean>;
}

declare interface XRRigidTransform {
    readonly position: DOMPointReadOnly;
    readonly orientation: DOMPointReadOnly;
    readonly matrix: Float32Array;
    readonly inverse: XRRigidTransform;
}

declare interface XRSpace extends EventTarget {}

declare interface XRReferenceSpace extends XRSpace {
    getOffsetReferenceSpace(originOffset: XRRigidTransform): XRReferenceSpace;
}

type XREye = "left" | "right";

declare interface XRView {
    readonly eye: XREye;
    readonly projectionMatrix: Float32Array;
    readonly transform: XRRigidTransform;
}

declare interface XRViewerPose {
    readonly transform: XRRigidTransform;
    readonly views: Array<XRView>;
}

declare class XRRay {
    readonly origin: DOMPointReadOnly;
    readonly direction: DOMPointReadOnly;
    matrix: Float32Array;

    constructor(origin: DOMPointInit, direction: DOMPointInit);
}

declare interface XRPose {
    readonly emulatedPosition: boolean;
    readonly transform: XRRigidTransform;
}

type XRHandedness = "" | "left" | "right";
type XRTargetRayMode = "gaze" | "tracked-pointer" | "screen";

declare interface XRInputSource {
    readonly gamepad: Gamepad | null;
    readonly handedness: XRHandedness;
    readonly targetRayMode: XRTargetRayMode;
    readonly targetRaySpace: XRSpace;
    readonly gripSpace?: XRSpace;
    readonly profiles: Array<String>;
}

declare interface XRFrame {
    readonly session: XRSession;
    getViewerPose(referenceSpace?: XRReferenceSpace): XRViewerPose;
    getPose(space: XRSpace, referenceSpace: XRReferenceSpace): XRPose;
    getHitTestResults(hitTestSource: XRHitTestSource): Array<XRHitTestResult>;
}

type XRFrameRequestCallback = (time: number, frame: XRFrame) => void;

declare interface XRRenderState {
    readonly depthNear: number;
    readonly depthFar: number;
    readonly inlineVerticalFieldOfView?: number;
    readonly baseLayer?: XRWebGLLayer;
}

declare interface XRRenderStateInit {
    depthNear?: number;
    depthFar?: number;
    inlineVerticalFieldOfView?: number;
    baseLayer?: XRWebGLLayer;
}

declare interface XRHitTestOptionsInit {
    space: XRSpace;
    ray?: XRRay;
}

declare interface XRSession extends EventTarget {
    renderState: XRRenderState;
    updateRenderState(state?: XRRenderStateInit): any;
    requestReferenceSpace(type: XRReferenceSpaceType): Promise<XRReferenceSpace>;
    requestHitTestSource(options: XRHitTestOptionsInit): Promise<XRHitTestSource>;
    inputSources: Array<XRInputSource>;
    requestAnimationFrame(callback: XRFrameRequestCallback): number;
    cancelAnimationFrame(id: number): void;
    end(): Promise<void>;
}

declare interface XRViewport {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}

declare interface XRLayer {}

declare class XRWebGLLayer implements XRLayer {
    public framebuffer: WebGLFramebuffer;
    public framebufferWidth: number;
    public framebufferHeight: number;

    constructor(session: XRSession, gl: WebGLRenderingContext, options?: WebGLContextAttributes);

    getViewport(view: XRView): XRViewport;
}

declare interface Window {
    XRSession?: Constructor<XRSession>;
    XR?: Constructor<XR>;
}

declare interface Navigator {
    xr: XR;
}

declare interface WebGLRenderingContext {
    makeXRCompatible(): Promise<void>;
}
