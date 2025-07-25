import ImageIO
import Vision
import VisionCamera

@objc(FaceDetectorFrameProcessorPluginPlugin)
public class FaceDetectorFrameProcessorPluginPlugin: FrameProcessorPlugin {
  public override init(proxy: VisionCameraProxyHolder, options: [AnyHashable: Any]! = [:]) {
    super.init(proxy: proxy, options: options)
  }

  public override func callback(_ frame: Frame, withArguments arguments: [AnyHashable: Any]?)
    -> Any?
  {
    var results: [[String: Any]] = []

    guard let pixelBuffer = CMSampleBufferGetImageBuffer(frame.buffer) else {
      return nil
    }

    let request = VNDetectFaceLandmarksRequest { request, error in
      guard let observations = request.results as? [VNFaceObservation], error == nil else { return }

      let frameWidth = CGFloat(frame.width)
      let frameHeight = CGFloat(frame.height)

      for face in observations {
        let rect = face.boundingBox
        let x = rect.origin.x * frameWidth
        // Compute the top-left Y position of the bounding box
        let y = (1.0 - (rect.origin.y + rect.size.height))
        let width = rect.size.width * frameWidth
        let height = rect.size.height * frameHeight

        var faceResult: [String: Any] = [
          "x": x,
          "y": y,
          "width": width,
          "height": height,
        ]

        if let landmarks = face.landmarks {
          var contours: [String: [[String: CGFloat]]] = [:]

          let map: [(String, VNFaceLandmarkRegion2D?)] = [
            ("FACE", landmarks.faceContour),
            ("LEFT_CHEEK", landmarks.leftEye),  // approximate
            ("RIGHT_CHEEK", landmarks.rightEye),  // approximate
          ]

          for (name, region) in map {
            if let region = region {
              let points: [[String: CGFloat]] = region.normalizedPoints.map { point in
                let absoluteX = (rect.origin.x + point.x * rect.size.width) * frameWidth
                let absoluteY = (1.0 - (rect.origin.y + point.y * rect.size.height)) * frameHeight
                return ["x": absoluteX, "y": absoluteY]
              }
              contours[name] = points
            }
          }

          faceResult["contours"] = contours
        }

        results.append(faceResult)
      }
    }
    let orientation = cgOrientation(from: frame.orientation)
    let handler = VNImageRequestHandler(
      cvPixelBuffer: pixelBuffer, orientation: orientation, options: [:])
    try? handler.perform([request])

    return results
  }
  private func cgOrientation(from uiOrientation: UIImage.Orientation) -> CGImagePropertyOrientation
  {
    switch uiOrientation {
    case .up: return .up
    case .down: return .down
    case .left: return .leftMirrored
    case .right: return .leftMirrored
    case .upMirrored: return .upMirrored
    case .downMirrored: return .downMirrored
    case .leftMirrored: return .leftMirrored
    case .rightMirrored: return .rightMirrored
    @unknown default: return .right
    }
  }

}
