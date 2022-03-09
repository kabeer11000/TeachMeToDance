/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import * as posenet_module from '@tensorflow-models/posenet';
import * as facemesh_module from '@tensorflow-models/facemesh';
import * as paper from 'paper';
// import Stats from 'stats.js';
// import "babel-polyfill";
import {SVGUtils} from './utils/svgUtils'
import {PoseIllustration} from './illustrationGen/illustration';
import {Skeleton} from './illustrationGen/skeleton';

import * as girlSVG from './resources/illustration/girl.svg';
import * as boySVG from './resources/illustration/boy.svg';
import * as abstractSVG from './resources/illustration/abstract.svg';
import * as blathersSVG from './resources/illustration/blathers.svg';
import * as tomNookSVG from './resources/illustration/tom-nook.svg';
import aggregation from "../../utilities/aggregation";

class Parameters {
// Camera stream video element
    video;
    videoWidth = 300;
    videoHeight = 300;
// Canvas
    defaultPoseNetArchitecture = 'MobileNetV1';
    defaultQuantBytes = 2;
    defaultMultiplier = 1.0;
    defaultStride = 16;
    defaultInputResolution = 200;

    faceDetection = null;
    illustration = null;
    canvasScope;
    canvasWidth = 800;
    canvasHeight = 800;
// ML models
    facemesh;
    posenet;
    minPoseConfidence = 0.15;
    minPartConfidence = 0.1;
    nmsRadius = 30.0;
// Misc
    mobile = false;
    avatarSvgs = {
        'girl': girlSVG.default,
        'boy': boySVG.default,
        'abstract': abstractSVG.default,
        'blathers': blathersSVG.default,
        'tom-nook': tomNookSVG.default,
    };
    videoCtx = null;
    keypointCtx = null;
    svg = {
        illustration: undefined
    }
    keypointCanvas = null

    constructor() {
        // this.mobile = isMobile();
        // if (this.mobile) {
        //     Object.assign(this, { height, width })
        // this.canvasWidth = Math.min(window.innerWidth, window.innerHeight);
        // this.canvasHeight = this.canvasWidth; // Square
        // this.videoWidth *= 0.7;
        // this.videoHeight *= 0.7;
        // }

        this.canvasScope = paper.default;
        this.canvas = document.querySelector('.illustration-canvas');
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
        this.canvasScope.setup(this.canvas);
        this.videoCtx = this.canvas.getContext('2d')

    }

    async UpdateAvatar(target) {
        let svgScope = await SVGUtils.importSVG(target /* SVG string or file path */);
        let skeleton = new Skeleton(svgScope);
        this.illustration = new PoseIllustration(this.canvasScope);
        this.illustration.bindSkeleton(skeleton, svgScope);
    }
}

class Draw extends Parameters {
    illustration = null

    constructor() {
        super();
    }

    DrawFrame = async ({poses}) => {
        this.keypointCtx.clearRect(0, 0, this.videoWidth, this.videoHeight);
        this.canvasScope.project.clear();

        if (poses.length >= 1 && this.illustration) {
            Skeleton.flipPose(poses[0]);

            if (this.faceDetection && this.faceDetection.length > 0) {
                let face = Skeleton.toFaceFrame(this.faceDetection[0]);
                this.illustration.updateSkeleton(poses[0], face);
            } else {
                this.illustration.updateSkeleton(poses[0], null);
            }
            this.illustration.draw(this.canvasScope, this.videoWidth, this.videoHeight);

            // if (guiState.debug.showIllustrationDebug) {
            //     this.illustration.debugDraw(this.canvasScope);
            // }
        }

        this.canvasScope.project.activeLayer.scale(
            this.canvasWidth / this.videoWidth,
            this.canvasHeight / this.videoHeight,
            new this.canvasScope.Point(0, 0));

        // End monitoring code for frames per second
        // stats.end();

        // requestAnimationFrame(poseDetectionFrame);

    }
}

class Detect extends aggregation(Parameters, Draw) {
    async DetectFrame() {
        // const videoCtx, keypointCtx;

        /**
         * Feeds an image to posenet to estimate poses - this is where the magic
         * happens. This function loops with a requestAnimationFrame method.
         */
        let poses = [];

        this.videoCtx.clearRect(0, 0, this.videoWidth, this.videoHeight);
        // Draw video
        this.videoCtx.save();
        this.videoCtx.scale(-1, 1);
        this.videoCtx.translate(-this.videoWidth, 0);
        const img = new Image(this.videoWidth);
        img.src = "https://thumbs.dreamstime.com/z/handsome-man-standing-relaxed-front-view-handsome-elegant-man-moccasins-gray-trousers-white-shirt-standing-relaxed-front-173443511.jpg"
        this.videoCtx.drawImage(img, 0, 0, this.videoWidth, this.videoHeight);
        this.videoCtx.restore();

        // Creates a tensor from an image
        // const input = tf.browser.fromPixels(this.canvas);
        // console.log(input)
        // this.faceDetection = await this.facemesh.estimateFaces(input, false, false);
        let all_poses = await this.posenet.estimatePoses(this.video, {
            flipHorizontal: true,
            decodingMethod: 'multi-person',
            maxDetections: 1,
            scoreThreshold: this.minPartConfidence,
            nmsRadius: this.nmsRadius
        });
        poses = poses.concat(all_poses);
        // input.dispose();
        return poses;
    }
}

export class PoseAnimator extends aggregation(Parameters, Draw, Detect) {
    #Props = {}

    constructor({SVG, MediaStream, Video}) {
        super();
        this.#Props = {SVG, MediaStream, Video}
        // this.#loader({SVG, MediaStream, Video})
    }

    async Build() {
        console.log('Loading...');
        [this.posenet, this.facemesh] = (await Promise.allSettled([posenet_module.load({
            architecture: this.defaultPoseNetArchitecture,
            outputStride: this.defaultStride,
            inputResolution: this.defaultInputResolution,
            multiplier: this.defaultMultiplier,
            quantBytes: this.defaultQuantBytes
        }), facemesh_module.load()])).map(response => response.value);
        console.log(this.posenet, this.facemesh)
        // await this.UpdateAvatar(this.#Props.SVG);

        // const video = Video;
        this.#Props.Video.width = this.videoWidth;
        this.#Props.Video.height = this.videoHeight;
        this.#Props.Video.srcObject = this.#Props.MediaStream;
        await this.#loadVideo();
        this.video = this.#Props.Video;
    }

    #loadVideo() {
        return new Promise(resolve => this.#Props.Video.onloadedmetadata = () => resolve())
    }
}

navigator.mediaDevices.getUserMedia({
    'audio': false,
    'video': {
        facingMode: 'user',
        width: 200,
        height: 200,
    },
}).then(async video => {
    const _p = new PoseAnimator({
        SVG: girlSVG.default,
        Video: document.getElementById("video"),
        MediaStream: video
    })
    await _p.Build();
    console.log(await _p.DetectFrame());
})
