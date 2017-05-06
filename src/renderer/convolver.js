var Canvas = require('canvas');

module.exports.convolve = function (pixels, weights, opaque) {

    var canvas = new Canvas();
    var ctx = canvas.getContext('2d');

    var side = Math.round(Math.sqrt(weights.length)); // 이미지 필터 가중치
    var halfSide = Math.floor(side/2); // 가중치 절반 값 저징
    var src = pixels.data; // 원본 데이터
    var sw = pixels.width; // 원본 데이터 넓이
    var sh = pixels.height; // 원본 데이터 높이
    var w = sw;
    var h = sh;
    var output = ctx.createImageData(w, h);
    var dst = output.data;
    var alphaFac = opaque ? 1 : 0;
    for (var y=0; y<h; y++) {
        for (var x=0; x<w; x++) {
            var sy = y;
            var sx = x;
            var dstOff = (y*w+x)*4;
            var r=0, g=0, b=0, a=0;
            for (var cy=0; cy<side; cy++) {
                for (var cx=0; cx<side; cx++) {
                    var scy = sy + cy - halfSide;
                    var scx = sx + cx - halfSide;
                    if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                        var srcOff = (scy*sw+scx)*4;
                        var wt = weights[cy*side+cx];
                        r += src[srcOff] * wt;
                        g += src[srcOff+1] * wt;
                        b += src[srcOff+2] * wt;
                        a += src[srcOff+3] * wt;
                    }
                }
            }
            dst[dstOff] = r;
            dst[dstOff+1] = g;
            dst[dstOff+2] = b;
            dst[dstOff+3] = a + alphaFac*(255-a);
        }
    }
    return output;
};