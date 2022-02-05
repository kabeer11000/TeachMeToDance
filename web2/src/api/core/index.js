import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
// Register one of the TF.js backends.
import '@tensorflow/tfjs-backend-webgl';
// import '@tensorflow/tfjs-backend-wasm';
export const Model = async () => {
    let _director = undefined;
    let _tf_ready = false;
    return ({
        Ready: async function () {
            await tf.ready();
            await tf.setBackend("webgl");
            _tf_ready = true;
        },
        Director: async function () {
            const detectorConfig = {
                modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
                enableTracking: true,
                trackerType: poseDetection.TrackerType.BoundingBox
            };
            _director = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
            return _director;
        },
        Estimator: {
            // _this: this._this,
            /** tf.Tensor3D, ImageData, HTMLVideoElement, HTMLImageElement, HTMLCanvasElement **/
            estimatePoses: async function (image) {
                console.log(_director)
                return await _director.estimatePoses(image);
            }
        }
    })
}
/*
export const _Model = {
    _director: null,
    _this: this,
    _tf_ready: false,
    Ready: async function () {
        await tf.ready();
        await tf.setBackend("webgl");
        Model._tf_ready = true;
    },
    Director: async function () {
        const detectorConfig = {
            modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
            enableTracking: true,
            trackerType: poseDetection.TrackerType.BoundingBox
        };
        Model._director = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
        return Model._director;
    },
    Estimator: {
        // _this: this._this,
        estimatePoses: async function (image) {
            console.log(Model._director)
            return await Model._director.estimatePoses(image);
        }
    }
}
*/
// /** tf.Tensor3D, ImageData, HTMLVideoElement, HTMLImageElement, HTMLCanvasElement **/

// tf.ready().then(() => {
//     tf.setBackend("webgl").then(() => {
//         const detectorConfig = {
//             modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
//             enableTracking: true,
//             trackerType: poseDetection.TrackerType.BoundingBox
//         };
//         poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig).then(console.log);
//     })
// })
