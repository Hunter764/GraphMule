import React from 'react';
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';
import * as THREE from 'three';

export default function Background3D() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <ShaderGradientCanvas
        style={{
          width: '100%',
          height: '100%',
        }}
        lazyLoad={undefined}
        
        fov={undefined}
        pixelDensity={4}
        pointerEvents="none"
      >
        <ShaderGradient
          animate="on"
          type="waterPlane"
          wireframe={false}
          shader="defaults"
          uTime={8}
          uSpeed={0.3}
          uStrength={1.5}
          uDensity={1.5}
          uFrequency={0}
          uAmplitude={0}
          positionX={0}
          positionY={0}
          positionZ={0}
          rotationX={50}
          rotationY={0}
          rotationZ={-60}
          color1="#896bc5"
          color2="#9996a8"
          color3="#212121"
          reflection={0.1}

          // View (camera) props
          cAzimuthAngle={180}
          cPolarAngle={80}
          cDistance={2.8}
          cameraZoom={9.1}

          // Effect props
          lightType="3d"
          brightness={1}
          envPreset="city"
          grain="on"

          // Tool props
          toggleAxis={false}
          zoomOut={false}
          hoverState=""

          // Optional - if using transition features
          enableTransition={false}
        />
      </ShaderGradientCanvas>
       {/* Overlay to ensure text readability if needed */}
       <div className="absolute inset-0 bg-black/20 pointer-events-none" />
    </div>
  );
}
