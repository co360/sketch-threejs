var Util = require('../modules/util');
var HemiLight = require('../modules/hemiLight');
var Force = require('../modules/force');

var Image = function() {
  this.obj = null;
  Force.call(this);
};
var image_geometry = new THREE.PlaneGeometry(200, 100);
Image.prototype = Object.create(Force.prototype);
Image.prototype.constructor = Image;
Image.prototype.init = function(vector) {
  var image_material = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide
  });
  this.obj = new THREE.Mesh(image_geometry, image_material);
  this.position = this.obj.position;
  this.velocity = vector.clone();
  this.anchor = vector.clone();
  this.acceleration.set(0, 0, 0);
};
Image.prototype.lookAtCenter = function() {
  this.obj.lookAt({
    x: 0,
    y: 0,
    z: 0
  });
};

var exports = function(){
  var Sketch = function() {};
  var images = [];
  var images_num = 30;

  var hemi_light = new HemiLight();

  var initImages = function(scene) {
    for (var i = 0; i < images_num; i++) {
      var image = null;
      var vector = Util.getSpherical(0, Util.getRadian((i + 1) / images_num * 360), 40 * images_num);
      image = new Image();
      image.init(new THREE.Vector3());
      image.anchor.copy(vector);
      scene.add(image.obj);
      images.push(image);
    }
  };

  Sketch.prototype = {
    init: function(scene, camera) {
      initImages(scene);
      hemi_light.init();
      scene.add(hemi_light.obj);
      camera.anchor = Util.getSpherical(Util.getRadian(40), Util.getRadian(0), 200 * images_num);
    },
    remove: function(scene) {
    },
    render: function(camera) {
      for (var i = 0; i < images_num; i++) {
        images[i].applyHook(0, 0.1);
        images[i].applyDrag(0.3);
        images[i].updateVelocity();
        images[i].updatePosition();
        images[i].lookAtCenter();
      }
      camera.applyHook(0, 0.025);
      camera.applyDrag(0.2);
      camera.updateVelocity();
      camera.updatePosition();
      camera.lookAtCenter();
    }
  };
  return Sketch;
};

module.exports = exports();