path        = require('path')
gm          = require('gm')
imageMagick = gm.subClass({ imageMagick: true })

class Imager
  minSize: 40
  maxSize: 400

  combine: (face, size, callback) ->
    if callback?
      size = @_parseSize(size)
    else
      callback = size
      size = width: @maxSize, height: @maxSize

    imageMagick()
      .in(face.eyes)
      .in(face.nose)
      .in(face.mouth)
      .mosaic()
      .resize(size.width, size.height)
      .trim()
      .autoOrient()
      .gravity('Center')
      .extent(size.width, size.height)
      .background(face.color)
      .stream('png', callback)

  resize: (imagePath, size, callback) ->
    size = @_parseSize(size)

    imageMagick(imagePath)
      .resize(size.width, size.height)
      .trim()
      .autoOrient()
      .stream('png', callback)

  _clamp: (num) -> return Math.min(Math.max(num, @minSize), @maxSize)

  _parseSize: (size) ->
    [width, height] = size.split("x")
    height?= width
    return { width: @_clamp(width), height: @_clamp(height) }

module.exports = new Imager()
