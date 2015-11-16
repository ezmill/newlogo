var container;
var scene, camera, light, renderer;
// var renderSize = new THREE.Vector2(window.innerWidth, (3000)*window.innerHeight/2000);
var renderSize = new THREE.Vector2(window.innerWidth, window.innerHeight);
//wtf
// var renderSize = new THREE.Vector2(2448/2,3264/2);
// var renderSize = new THREE.Vector2(1200,846);
// var renderSize = new THREE.Vector2((2448/3)*window.innerHeight/(3264/3),window.innerHeight);
var mouse = new THREE.Vector2(0.0,0.0);
var mouseDown = false;
// var r2 = 1.0;
var r2 = 10.0;
var time = 0.0;
var capturer = new CCapture( { framerate: 60, format: 'webm', workersPath: 'js/' } );

init();
animate();

function init(){

    normalScene = new THREE.Scene();
    normalCamera = new THREE.OrthographicCamera( renderSize.x / - 2, renderSize.x / 2, renderSize.y / 2, renderSize.y / - 2, -10000, 10000 );
    // normalCamera = new THREE.PerspectiveCamera( 45, renderSize.x/renderSize.y, 0.01, 100000 );
    normalCamera.position.z = 3500;
    normalRenderer = new THREE.WebGLRenderer({preserveDrawingBuffer:true});
    normalRenderer.setSize( renderSize.x, renderSize.y );
    normalRenderer.setClearColor(0x000000,1.0);

    ambientLight = new THREE.AmbientLight( 0xffffff );
    normalScene.add( ambientLight );

    pointLight = new THREE.PointLight( 0xff0000, 1.0, 1000 );
    pointLight.position.set( 0, 0, 600 );

    normalScene.add( pointLight );

    directionalLight = new THREE.DirectionalLight( 0xffffff );
    directionalLight.position.set( 1, -0.5, -1 );
    normalScene.add( directionalLight );

    normalMaterial = new THREE.ShaderMaterial( {

        uniforms: { 
            tNormal: {type: 't', value: THREE.ImageUtils.loadTexture( 'assets/textures/images.jpg' ) },
            // tCol: {type: 't', value: colTex },
            tMatCap: {type: 't', value: THREE.ImageUtils.loadTexture( 'assets/textures/rubymatcap.jpg' ) },
            time: {type: 'f', value: 0 },
            bump: {type: 'f', value: 0 },
            noise: {type: 'f', value: .04 },
            repeat: {type: 'v2', value: new THREE.Vector2( 1, 1 ) },
            resolution: {type: 'v2', value: null },
            mouse: {type: 'v2', value: new THREE.Vector2( 0.0,0.0 ) },
            useNormal: {type: 'f', value: 1 },
            useRim: {type: 'f', value: 0 },
            rimPower: {type: 'f', value: 2 },
            useScreen: {type: 'f', value: 0 },
            normalScale: {type: 'f', value: 1.0 },
            normalRepeat: {type: 'f', value: 4 }
        },
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
        // wrapping: THREE.ClampToEdgeWrapping,
        shading: THREE.SmoothShading,
        side: THREE.DoubleSide,
        // depthWrite: false
        
    } );

    normalMaterial.uniforms.tMatCap.value.wrapS = normalMaterial.uniforms.tMatCap.value.wrapT = 
    THREE.ClampToEdgeWrapping;
    normalMaterial.uniforms.resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);

    normalMaterial.uniforms.tNormal.value.wrapS = normalMaterial.uniforms.tNormal.value.wrapT = THREE.RepeatWrapping;
    var loader = new THREE.JSONLoader();
    loader.load( 'scripts/js/diamondpart.json', function( geometry, materials ) {
        // geometry
        geometry.verticesNeedUpdate = true;
        geometry.normalsNeedUpdate = true;
        geometry.uvsNeedUpdate = true;
        geometry.computeCentroids();
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        geometry.computeMorphNormals();
        geometry.computeTangents();
        normalMesh = new THREE.Mesh(geometry, normalMaterial);
        normalMesh.position.set(-25,-50,0);
        normalMesh.scale.set(0.25,0.25,0.25);
        normalScene.add(normalMesh);
    });
    normalMaterial2 = new THREE.ShaderMaterial( {

        uniforms: { 
            tNormal: {type: 't', value: THREE.ImageUtils.loadTexture( 'assets/textures/images.jpg' ) },
            // tCol: {type: 't', value: colTex },
            tMatCap: {type: 't', value: THREE.ImageUtils.loadTexture( 'assets/textures/gold.jpg' ) },
            time: {type: 'f', value: 0 },
            bump: {type: 'f', value: 0 },
            noise: {type: 'f', value: .04 },
            repeat: {type: 'v2', value: new THREE.Vector2( 1,1 ) },
            resolution: {type: 'v2', value: null },
            mouse: {type: 'v2', value: new THREE.Vector2( 0.0,0.0 ) },
            useNormal: {type: 'f', value: 0 },
            useRim: {type: 'f', value: 0 },
            rimPower: {type: 'f', value: 2 },
            useScreen: {type: 'f', value: 0 },
            normalScale: {type: 'f', value: 2.0 },
            normalRepeat: {type: 'f', value: 4 }
        },
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
        // wrapping: THREE.ClampToEdgeWrapping,
        shading: THREE.SmoothShading,
        side: THREE.DoubleSide,
        // depthWrite: false
        
    } );

    normalMaterial2.uniforms.tMatCap.value.wrapS = normalMaterial2.uniforms.tMatCap.value.wrapT = 
    THREE.ClampToEdgeWrapping;

    var loader = new THREE.JSONLoader();
    loader.load( 'scripts/js/goldpart.json', function( geometry, materials ) {
        // geometry
        geometry.verticesNeedUpdate = true;
        geometry.normalsNeedUpdate = true;
        geometry.uvsNeedUpdate = true;
        geometry.computeCentroids();
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        geometry.computeMorphNormals();
        geometry.computeTangents();
        normalMesh2 = new THREE.Mesh(geometry, normalMaterial2);
        normalMesh2.position.set(-25,-50,0);
        normalMesh2.scale.set(0.25,0.25,0.25);

        normalScene.add(normalMesh2);
    });
    // normalGeometry = new THREE.CubeGeometry(500,500,500);
// 
    // normalGeometry.verticesNeedUpdate = true;
    // normalGeometry.normalsNeedUpdate = true;
    // normalGeometry.uvsNeedUpdate = true;
    // normalGeometry.computeCentroids();
    // normalGeometry.computeFaceNormals();
    // normalGeometry.computeVertexNormals();
    // normalGeometry.computeMorphNormals();
    // normalGeometry.computeTangents();

    // normalMesh = new THREE.Mesh(normalGeometry, normalMaterial);
    // normalMesh.position.set(0,0,0);
    // normalScene.add(normalMesh);

    container = document.getElementById("container");
    container.appendChild(normalRenderer.domElement);


	document.addEventListener("mousemove", onMouseMove);
	document.addEventListener("mousedown", onMouseDown);
	document.addEventListener("mouseup", onMouseUp);
    document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    document.addEventListener( 'touchmove', onDocumentTouchMove, false );
    document.addEventListener( 'touchend', onDocumentTouchEnd, false );
    document.addEventListener( 'touchcancel', onDocumentTouchEnd, false );
    document.addEventListener( 'touchleave', onDocumentTouchEnd, false );
    document.addEventListener( 'keydown', function(){screenshot(normalRenderer)}, false );

}

function animate(){
	window.requestAnimationFrame(animate);
	draw();
}

function onMouseMove(event){
	mouse.x = ( event.pageX / renderSize.x ) * 2 - 1;
    mouse.y = - ( event.pageY / renderSize.y ) * 2 + 1;
}
function onDocumentTouchStart( event ) {
    if ( event.touches.length === 1 ) {
        event.preventDefault();
        r2 = Math.random()*2.0;
        mouse.x = ( event.touches[ 0 ].pageX / renderSize.x ) * 2 - 1;
        mouse.y = - ( event.touches[ 0 ].pageY / renderSize.y ) * 2 + 1;
    }
}

function onDocumentTouchMove( event ) {
    if ( event.touches.length === 1 ) {
        event.preventDefault();
        mouse.x = ( event.touches[ 0 ].pageX / renderSize.x ) * 2 - 1;
        mouse.y = - ( event.touches[ 0 ].pageY / renderSize.y ) * 2 + 1;
    }
}
    
function onDocumentTouchEnd( event ) {
    mouse.x = 0; 
    mouse.y = 0;
}
var counter = 0;
function onMouseDown(){
	mouseDown = true;

}
function onMouseUp(){
	mouseDown = false;
}
function draw(){

	time += 0.01;
    // normalMesh.rotation.x += 0.01;
    normalMesh.rotation.y += 0.01;
    normalMesh2.rotation.y += 0.01;
    // normalMesh.rotation.z += 0.01;
    normalRenderer.render(normalScene, normalCamera);
    capturer.capture( normalRenderer.domElement );

}
function screenshot(renderer) {
    if (event.keyCode == "32") {
        grabScreen(renderer);

        function grabScreen(renderer) {
            var blob = dataURItoBlob(renderer.domElement.toDataURL('image/png'));
            var file = window.URL.createObjectURL(blob);
            var img = new Image();
            img.src = file;
            img.onload = function(e) {
                window.open(this.src);

            }
        }
        function dataURItoBlob(dataURI) {
            var byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
            else
                byteString = unescape(dataURI.split(',')[1]);

            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            return new Blob([ia], {
                type: mimeString
            });
        }

        function insertAfter(newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }
    }
    if (event.keyCode == "82") {
                    capturer.start();
    }
    if (event.keyCode == "84") {
        capturer.stop();
        capturer.save(function(blob) {
            window.location = blob;
        });
    }
}
function hslaColor(h,s,l,a)
  {
    return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
  }