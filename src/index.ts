import {
    ViewerApp,
    AssetManagerPlugin,
    GBufferPlugin,
    ProgressivePlugin,
    TonemapPlugin,
    SSRPlugin,
    SSAOPlugin,
    BloomPlugin,
    GammaCorrectionPlugin,
    Vector3,
    MeshBasicMaterial2,
    Color,
    AssetImporter,
    DiamondPlugin,
    FrameFadePlugin,
    GLTFAnimationPlugin,
    GroundPlugin,
    TemporalAAPlugin,
    AnisotropyPlugin,
    addBasePlugins,
    CanvasSnipperPlugin,
    mobileAndTabletCheck
} from "webgi";
import "./styles.css";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

async function setupViewer(){

    // Initialize the viewer
    const viewer = new ViewerApp({
        canvas: document.getElementById('webgi-canvas') as HTMLCanvasElement,
        useRgbm: false, // Use RGBM encoding!!
    })

    const isMobile = mobileAndTabletCheck()
    console.log(isMobile)

    // Add plugins individually.
    const manager = await viewer.addPlugin(AssetManagerPlugin)
    const camera = viewer.scene.activeCamera
    const position = camera.position
    const target = camera.target

    const exitButton = document.querySelector('.button-exit') as HTMLElement
    const customizerInterface = document.querySelector('.customizer-container') as HTMLElement
    
    await viewer.addPlugin(GBufferPlugin)
    await viewer.addPlugin(new ProgressivePlugin(32))
    await viewer.addPlugin(new TonemapPlugin(!viewer.useRgbm))
    await viewer.addPlugin(GammaCorrectionPlugin)
    await viewer.addPlugin(SSRPlugin)
    await viewer.addPlugin(SSAOPlugin)
    // await viewer.addPlugin(BloomPlugin)
    await viewer.addPlugin(DiamondPlugin)
    // await viewer.addPlugin(FrameFadePlugin)
    // await viewer.addPlugin(GLTFAnimationPlugin)
    // await viewer.addPlugin(GroundPlugin)
    // await viewer.addPlugin(TemporalAAPlugin)
    // await viewer.addPlugin(AnisotropyPlugin)
    // await addBasePlugins(viewer)

    // Loader
    const importer = manager.importer as AssetImporter
    importer.addEventListener('onProgress', (event) => {
        const progressRatio = (event.loaded / event.total)
        console.log(`Progress: ${progressRatio}`)
    })

    importer.addEventListener('onLoad', (event) => {
        gsap.to('.loader', {y: '-100%', duration: 0.8, ease: 'power2.inOut', delay: 1, onComplete: () => {
            document.body.style.overflowY = 'auto'
        }})
    })

    viewer.renderer.refreshPipeline()
    

    await manager.addFromPath("./assets/scene.glb")
    


    const drillMaterial = manager.materials?.findMaterialsByName('Material.002')[0] as MeshBasicMaterial2

    viewer.getPlugin(TonemapPlugin)!.config!.clipBackground = true
    
    viewer.scene.activeCamera.setCameraOptions({controlsEnabled: false})
    window.scrollTo(0,0)
    // onUpdate()

    // position.set(-5.26, 0.38, 5.61)

    if (isMobile){
        position.set(-9.18, 4.31, 3.22)
        target.set(0.13, -0.09, -0.96)
    } else {
        position.set(4.21, 5.95, -4.54)
        target.set(1.72, 0.14, 1.09)
    }

    function setupScrollAnimation() {
        const tl = gsap.timeline()
    
        // First section
        tl.to(position, {x: isMobile ? 5.6 : 1.56, y: isMobile ? 9.13 : -2.26, z: isMobile ? 1.97 : -3.85,
            scrollTrigger: {
                trigger: ".second",
                start: "top bottom",
                end: "top top",
                scrub: true,
                immediateRender: false,
            }
            , onUpdate})
            .to(".section-one-container",
                {xPercent: '150',
                opacity: 0,
                scrollTrigger: {
                    trigger: ".second",
                    start: "top bottom",
                    end: "top 80%",
                    scrub: 1,
                    immediateRender: false,
                }})
            .to(target, {x: isMobile ? 0.13 : -1.37, y: isMobile ? -0.09 : 1.99, z: isMobile ? -0.96 : -0.37,
                scrollTrigger: {
                    trigger: ".second",
                    start: "top bottom",
                    end: "top top",
                    scrub: true,
                    immediateRender: false,
                }})
        // Last section
            .to(position, {x: isMobile ? -1.35 : -3.4, y: isMobile ? 10.96 : 9.63, z: isMobile ? -0.84 : 1.71,
                scrollTrigger: {
                    trigger: ".third",
                    start: "top bottom",
                    end: "top top",
                    scrub: true,
                    immediateRender: false,
                }
                , onUpdate})
            .to(".section-two-text",
                {xPercent: '-150',
                opacity: 0,
                scrollTrigger: {
                    trigger: ".third",
                    start: "top bottom",
                    end: "top 80%",
                    scrub: 1,
                    immediateRender: false,
                }})
            .to(target, {x: isMobile ? -0.24 : -1.56, y: isMobile ? -0.10 : 2.13, z: isMobile ? -0.82 : -0.44,
                scrollTrigger: {
                    trigger: ".third",
                    start: "top bottom",
                    end: "top top",
                    scrub: true,
                    immediateRender: false,
                }})
    }

    setupScrollAnimation()

    // WEBGL Update
    let needsUpdate = true
    function onUpdate() {
        needsUpdate = true
        viewer.renderer.resetShadows()
    }

    viewer.addEventListener('preFrame', () => {
        if(needsUpdate){
            camera.positionUpdated(false)
            camera.targetUpdated(true)
            needsUpdate = false
        }
    })

    // KNOW MORE
    document.querySelector('.button-hero')?.addEventListener('click', () => {
        const element = document.querySelector('.second')
        window.scrollTo({top: element?.getBoundingClientRect().top, left:0, behavior: 'smooth'})
    })

    // SCROLL TO TOP
    document.querySelector('.button-footer')?.addEventListener('click', () => {
        window.scrollTo({top: 0, left:0, behavior: 'smooth'})
    })

    // Customize
    const sections = document.querySelector('.container') as HTMLElement
    const mainContainer = document.getElementById('webgi-canvas-container') as HTMLElement
    document.querySelector('.button-customize')?.addEventListener('click', () => {
        sections.style.visibility = 'hidden'
        mainContainer.style.pointerEvents = 'all'
        document.body.style.cursor = 'grab'
        gsap.to(position, {x: isMobile ? -10.0 : -2.6, y: isMobile ? 0.48 : 0.2, z: isMobile ? 7.85 : -9.6, duration: 2, ease: 'power2.inOut', onUpdate})
        gsap.to(target, {x: isMobile ? -0.53 : -0.15, y: isMobile ? -0.25 : 0, z: isMobile ? 0.46 : 0.12, duration: 2, ease: 'power2.inOut', onUpdate, onComplete: enableControllers})
    })

    function enableControllers(){
        exitButton.style.visibility = 'visible'
        customizerInterface.style.visibility = 'visible'
        viewer.scene.activeCamera.setCameraOptions({controlsEnabled: true})
    }

    // EXIT Customizer
    exitButton.addEventListener('click', () => {
        gsap.to(position, {x: isMobile ? -1.35 : -3.4, y: isMobile ? 10.96 : 9.63, z: isMobile ? -0.84 : 1.71, duration: 1, ease: 'power2.inOut', onUpdate})
        gsap.to(target, {x: isMobile ? -0.24 : -1.56, y: isMobile ? -0.10 : 2.13, z: isMobile ? -0.82 : -0.44, duration: 1, ease: 'power2.inOut', onUpdate})
        exitButton.style.visibility = 'hidden'
        customizerInterface.style.visibility = 'hidden'
        viewer.scene.activeCamera.setCameraOptions({controlsEnabled: false})
        sections.style.visibility = 'visible'
        mainContainer.style.pointerEvents = 'none'
        document.body.style.cursor = 'default'
    })

    document.querySelector('.button-colors.red')?.addEventListener('click', () => {
        changeColor(new Color(0xff0808).convertSRGBToLinear())
    })

    document.querySelector('.button-colors.blue')?.addEventListener('click', () => {
        changeColor(new Color(0x0029f7).convertSRGBToLinear())
    })

    document.querySelector('.button-colors.white')?.addEventListener('click', () => {
        changeColor(new Color(0xffffff).convertSRGBToLinear())
    })

    function changeColor(_colorToBeChanged: Color){
        drillMaterial.color = _colorToBeChanged
        viewer.scene.setDirty()
    }

}

setupViewer()
