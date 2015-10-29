var Util = require('./util');
var Mover = require('./mover');

var exports = function(){
  var Points = function() {
    this.movers_num = 100000;
    this.movers = [];
    this.geometry = null;
    this.material = null;
    this.obj = null;
    this.texture = null;
    this.positions = new Float32Array(this.movers_num * 3);
    this.colors = new Float32Array(this.movers_num * 3);
    this.gravity = new THREE.Vector3(0, -0.05, 0);
  };
  
  Points.prototype = {
    init: function() {
      this.createTexture();
      this.geometry = new THREE.BufferGeometry();
      this.material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 16,
        transparent: true,
        opacity: 0.7,
        map: this.texture,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        vertexColors: THREE.VertexColors
      });
      for (var i = 0; i < this.movers_num; i++) {
        var mover = new Mover();
        var color = new THREE.Color('hsl(' + Util.getRandomInt(20, 240) + ', 60%, 50%)');

        mover.init(new THREE.Vector3(0, 0, 0));
        this.movers.push(mover);
        this.positions[i * 3 + 0] = mover.position.x;
        this.positions[i * 3 + 1] = mover.position.y;
        this.positions[i * 3 + 2] = mover.position.z;
        color.toArray(this.colors, i * 3);
      }
      this.geometry.addAttribute('position', new THREE.BufferAttribute(this.positions, 3));
      this.geometry.addAttribute('color', new THREE.BufferAttribute(this.colors, 3));
      this.obj = new THREE.Points(this.geometry, this.material);
    },
    update: function() {
      for (var i = 0; i < this.movers.length; i++) {
        var mover = this.movers[i];
        if (mover.is_active) {
          mover.applyForce(this.gravity);
          mover.updateVelocity();
          mover.updatePosition();
          if (mover.position.y < -1000) {
            mover.inactivate();
          }
        }
        this.positions[i * 3 + 0] = mover.position.x;
        this.positions[i * 3 + 1] = mover.position.y;
        this.positions[i * 3 + 2] = mover.position.z;
      }
      this.obj.geometry.position = this.positions;
      this.obj.geometry.attributes.position.needsUpdate = true;
    },
    activateMover: function() {
      var count = 0;

      for (var i = 0; i < this.movers.length; i++) {
        var mover = this.movers[i];
        if (mover.is_active) continue;
        var rad1 = Util.getRadian(Math.log(Util.getRandomInt(12, 24)) / Math.log(24) * 90);
        var rad2 = Util.getRadian(Util.getRandomInt(0, 18) * 20);
        var force = Util.getSpherical(rad1, rad2, 5);
        mover.activate();
        mover.init(new THREE.Vector3(0, 0, 0));
        mover.applyForce(force);
        count++;
        if (count >= 200) break;
      }
    },
    createTexture: function() {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var grad = null;

      canvas.width = 200;
      canvas.height = 200;
      grad = ctx.createRadialGradient(100, 100, 20, 100, 100, 100);
      grad.addColorStop(0.2, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
      grad.addColorStop(1.0, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.arc(100, 100, 100, 0, Math.PI / 180, true);
      ctx.fill();
      this.texture = new THREE.Texture(canvas);
      this.texture.minFilter = THREE.NearestFilter;
      this.texture.needsUpdate = true;
    }
  };

  return Points;
};

module.exports = exports();
