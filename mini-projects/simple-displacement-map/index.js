function main() {
    
    class MyScene {
      constructor(canvas) {
        this.scene = new THREE.Scene();
    
        this.camera = new THREE.PerspectiveCamera(30, 16/9, 0.02, 50);
        this.camera.position.z = 3;

        this.textureLoader = new THREE.TextureLoader();
        this.colorMap = this.textureLoader.load("assets/color-sm.jpg");
        this.depthMap = this.textureLoader.load("assets/depth-sm.jpg");
        
        this.material = new THREE.MeshStandardMaterial({ 
            color: 0x000000,
            emissive: 0xffffff,
            emissiveMap: this.colorMap,
            displacementMap: this.depthMap,
            displacementScale: -1,
            displacementBias: 0,
        });
        
        this.mesh = new THREE.Mesh(
          new THREE.PlaneBufferGeometry(4/3, 1, 1024, 1024),
          this.material
        );
        this.scene.add(this.mesh);
              
        this.renderer = new THREE.WebGLRenderer({ canvas });
        this.effects = {
          	none: this.renderer,
            stereo: new THREE.StereoEffect(this.renderer),
            anaglyph: new THREE.AnaglyphEffect(this.renderer),
        };
        this.activeRenderer = this.renderer;
        
        this.settings = {
          distance: 3,
          mode: "none",
          showDepthMap: false,
        };
        
        this.viewport = {width: 1, height: 1};

      }
      
      setViewportSize(w, h) {
        this.viewport.width = w;
        this.viewport.height = h;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this._updateActiveRendererSize();
      }
      render(canvas) {
        this.activeRenderer.render(this.scene, this.camera);
      }
      _updateActiveRendererSize() {
        this.activeRenderer.setSize(this.viewport.width, this.viewport.height);
      }
      setMode(mode) {
        this.activeRenderer = this.effects[mode];
        this._updateActiveRendererSize();
      }
    }
    
    function objForEach(obj, fn) {
      Object.keys(obj).forEach(k => {
        fn(obj[k], k, obj);
      });
    }
    function resizeViewportTo(w, h) {
        myscene.setViewportSize(w, h);
        // canvas.width = w;
        // canvas.height = h;
    }
    function handleResize() {
        resizeViewportTo(canvas.offsetWidth, canvas.offsetHeight);
    }
    
    function init() {
        window.addEventListener("resize", e => {
            handleResize();
        });
        
        canvas.addEventListener("mousemove", e => {
            const viewport = myscene.viewport;
            mouse.x = (2 * e.clientX - viewport.width) / viewport.height;
            mouse.y = (2 * e.clientY - viewport.height) / viewport.height;
        });
        
        handleResize();
        
        setInterval(() => {            
            myscene.mesh.rotation.x = mouse.y * 0.5;
            myscene.mesh.rotation.y = mouse.x * 0.5;
            
            myscene.render();
        }, 50);
    }
    function initGui() {
				var gui = new dat.GUI();
				gui.add(myscene.settings, "mode", Object.keys(myscene.effects)).onChange(value => {
          myscene.setMode(value);
				});
				gui.add(myscene.settings, "showDepthMap").onChange(value => {
          myscene.material.emissiveMap = value ? myscene.depthMap : myscene.colorMap;
				});
				gui.add(myscene.settings, "distance").min(0).max(6).onChange(value => {
          myscene.camera.position.z = value;
				});
    }
    
    const canvas = document.getElementById("screen");
    const mouse = {x:0, y:0};
    const myscene = new MyScene(canvas);
    init();
    initGui();
}

main();
