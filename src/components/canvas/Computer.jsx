import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF, ContactShadows } from "@react-three/drei";
import * as THREE from 'three'
import { useSpring } from '@react-spring/core'
import { a as three } from '@react-spring/three'
import { a as web } from '@react-spring/web'

const Computer = ({ open, hinge, ...props }) => {
    const group = useRef()
    // Load model
    const { nodes, materials } = useGLTF('./mac-draco.glb')
    // Take care of cursor state on hover
    const [hovered, setHovered] = useState(false)
    useEffect(() => void (document.body.style.cursor = hovered ? 'pointer' : 'auto'), [hovered])
    // Make it float in the air when it's opened
    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, open ? Math.cos(t / 10) / 10 + 0.25 : 0, 0.1)
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, open ? Math.sin(t / 10) / 4 : 0, 0.1)
        group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, open ? Math.sin(t / 10) / 10 : 0, 0.1)
        group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, open ? (-2 + Math.sin(t)) / 3 : -4.3, 0.1)
    })
  
    return (
        <group
            ref={group}
            {...props}
            onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
            onPointerOut={(e) => setHovered(false)}
            dispose={null}>
            <three.group rotation-x={hinge} position={[0, -0.04, 0.41]}>
                <group position={[0, 2.96, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
                <mesh material={materials.aluminium} geometry={nodes['Cube008'].geometry} />
                <mesh material={materials['matte.001']} geometry={nodes['Cube008_1'].geometry} />
                <mesh material={materials['screen.001']} geometry={nodes['Cube008_2'].geometry} />
                </group>
            </three.group>
            <mesh material={materials.keys} geometry={nodes.keyboard.geometry} position={[1.79, 0, 3.45]} />
            <group position={[0, -0.1, 3.39]}>
                <mesh material={materials.aluminium} geometry={nodes['Cube002'].geometry} />
                <mesh material={materials.trackpad} geometry={nodes['Cube002_1'].geometry} />
            </group>
            <mesh material={materials.touchbar} geometry={nodes.touchbar.geometry} position={[0, -0.03, 1.2]} />
        </group>
    );
  };
  
const ComputersCanvas = () => {
    // This flag controls open state, alternates between true & false
    const [open, setOpen] = useState(false)
    // We turn this into a spring animation that interpolates between 0 and 1
    const props = useSpring({ open: Number(open) })
  
    return (
      <web.main className="h-[350px] w-full relative top-[250px]">
        <web.h1 className="absolute right-0 left-0 m-auto w-[100px] top-[180px]" style={{ opacity: props.open.to([0, 1], [1, 0]), transform: props.open.to((o) => `translate3d(-50%,px,400)`) }}>
        <p className="flex flex-auto">click me<svg className="fill-white" version="1.0" xmlns="http://www.w3.org/2000/svg" width="48.000000pt" height="48.000000pt" viewBox="0 0 48.000000 48.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,48.000000) scale(0.100000,-0.100000)"stroke="none"><path d="M60 400 c0 -17 7 -20 45 -20 49 0 107 -20 139 -48 28 -25 56 -91 56 -134 0 -35 -2 -37 -34 -40 l-35 -3 45 -47 44 -47 44 47 45 47 -35 3 c-33 3 -34 5 -34 45 -1 117 -105 216 -227 217 -46 0 -53 -3 -53 -20z"/></g></svg></p>
        </web.h1>
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, -25], fov: 35 }}>
          <three.pointLight position={[10, 10, 10]} intensity={1.5} color={props.open.to([0, 1], ['#f0f0f0', '#d25578'])} />
          <Suspense fallback={null}>
            <group rotation={[0, Math.PI, 0]} onClick={(e) => (e.stopPropagation(), setOpen(!open))}>
              <Computer open={open} hinge={props.open.to([0, 1], [1.575, -0.425])} />
            </group>
            <Environment preset="city" />
          </Suspense>
          <ContactShadows position={[0, -4.5, 0]} opacity={0.4} scale={20} blur={1.75} far={4.5} />
        </Canvas>
        </web.main>
    );
  };
  export default ComputersCanvas;