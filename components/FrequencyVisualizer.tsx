import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Line, G, Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

interface FrequencyVisualizerProps {
  frequency: number;
  amplitude: number;
  isActive: boolean;
  focusLevel: number;
}

export const FrequencyVisualizer: React.FC<FrequencyVisualizerProps> = ({
  frequency,
  amplitude,
  isActive,
  focusLevel,
}) => {
  const animationRef = useRef<number>(0);
  const phaseRef = useRef<number>(0);

  useEffect(() => {
    let animationId: number;

    const animate = () => {
      if (isActive) {
        phaseRef.current += 0.1;
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (isActive) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive]);

  const generateWaveform = (): string => {
    const points: string[] = [];
    const centerY = height * 0.3;
    const waveWidth = width * 0.8;
    const startX = width * 0.1;
    
    for (let x = 0; x <= waveWidth; x += 2) {
      const normalizedX = x / waveWidth;
      const waveY = Math.sin(normalizedX * Math.PI * 4 + phaseRef.current) * amplitude * 20;
      const y = centerY + waveY;
      
      if (x === 0) {
        points.push(`M ${startX + x} ${y}`);
      } else {
        points.push(`L ${startX + x} ${y}`);
      }
    }
    
    return points.join(' ');
  };

  const getColorByFocusLevel = (level: number): string => {
    const colors: Record<number, string> = {
      1: '#f59e0b',   // Beta - Orange
      3: '#10b981',   // Alpha - Green
      10: '#3b82f6',  // Alpha/Theta - Blue
      12: '#8b5cf6',  // Theta - Purple
      15: '#ec4899',  // Deep Theta - Pink
      21: '#ef4444',  // Theta/Delta - Red
    };
    return colors[level] || '#8b5cf6';
  };

  const color = getColorByFocusLevel(focusLevel);

  return (
    <View style={styles.container}>
      <Svg width={width} height={height * 0.6} style={styles.svg}>
        {/* Background Grid */}
        <G opacity={0.2}>
          {[...Array(10)].map((_, i) => (
            <Line
              key={`h-${i}`}
              x1="0"
              y1={(height * 0.6 / 10) * i}
              x2={width}
              y2={(height * 0.6 / 10) * i}
              stroke="#64748b"
              strokeWidth={0.5}
            />
          ))}
          {[...Array(8)].map((_, i) => (
            <Line
              key={`v-${i}`}
              x1={(width / 8) * i}
              y1="0"
              x2={(width / 8) * i}
              y2={height * 0.6}
              stroke="#64748b"
              strokeWidth={0.5}
            />
          ))}
        </G>

        {/* Center Line */}
        <Line
          x1="0"
          y1={height * 0.3}
          x2={width}
          y2={height * 0.3}
          stroke="#94a3b8"
          strokeWidth={1}
          opacity={0.5}
        />

        {/* Waveform */}
        {isActive && (
          <Path
            d={generateWaveform()}
            stroke={color}
            strokeWidth={3}
            fill="none"
            opacity={0.8}
          />
        )}

        {/* Frequency Indicators */}
        <G>
          {/* Left Channel Indicator */}
          <Circle
            cx={width * 0.2}
            cy={height * 0.5}
            r={isActive ? 8 + Math.sin(phaseRef.current * 2) * 2 : 6}
            fill={color}
            opacity={isActive ? 0.8 : 0.4}
          />
          
          {/* Right Channel Indicator */}
          <Circle
            cx={width * 0.8}
            cy={height * 0.5}
            r={isActive ? 8 + Math.sin(phaseRef.current * 2 + Math.PI) * 2 : 6}
            fill={color}
            opacity={isActive ? 0.8 : 0.4}
          />
        </G>

        {/* Binaural Beat Visualization */}
        {isActive && (
          <G opacity={0.6}>
            <Circle
              cx={width * 0.5}
              cy={height * 0.3}
              r={20 + Math.sin(phaseRef.current * 0.5) * 10}
              fill="none"
              stroke={color}
              strokeWidth={2}
            />
            <Circle
              cx={width * 0.5}
              cy={height * 0.3}
              r={40 + Math.sin(phaseRef.current * 0.5 + Math.PI) * 15}
              fill="none"
              stroke={color}
              strokeWidth={1}
              opacity={0.4}
            />
          </G>
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  svg: {
    backgroundColor: 'transparent',
  },
});