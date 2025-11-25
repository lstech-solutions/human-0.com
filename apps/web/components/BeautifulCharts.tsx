import React from 'react';
import { View, Text, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface ChartProps {
  data: number[];
  color?: string;
  height?: number;
}

export const BarChart: React.FC<ChartProps> = ({ data, color = '#00FF9C', height = 120 }) => {
  const maxValue = Math.max(...data);
  const barWidth = (width - 80) / data.length - 8;
  
  return (
    <View style={{ height }} className="justify-end items-center px-4">
      <View className="flex-row items-end justify-between w-full">
        {data.map((value, index) => {
          const barHeight = (value / maxValue) * (height - 30);
          const gradientOpacity = 0.4 + (index / data.length) * 0.6;
          
          return (
            <View key={index} className="items-center justify-end" style={{ width: barWidth + 8, height }}>
              {/* Bar with gradient effect */}
              <View 
                style={{ 
                  height: barHeight,
                  width: barWidth,
                  backgroundColor: color,
                  opacity: gradientOpacity,
                  borderRadius: 4,
                  shadowColor: color,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 3
                }}
              />
              {/* Value label on top of bar */}
              <Text 
                style={{ 
                  position: 'absolute', 
                  top: -20, 
                  color: color, 
                  fontSize: 10, 
                  fontWeight: 'bold',
                  textAlign: 'center',
                  width: barWidth
                }}
              >
                {value}
              </Text>
              {/* X-axis label */}
              <Text className="text-gray-400 text-xs mt-2" style={{ fontSize: 10 }}>
                {index + 1}
              </Text>
            </View>
          );
        })}
      </View>
      {/* X-axis line */}
      <View 
        style={{
          position: 'absolute',
          bottom: 25,
          left: 16,
          right: 16,
          height: 1,
          backgroundColor: '#374151'
        }}
      />
    </View>
  );
};

export const LineChart: React.FC<ChartProps> = ({ data, color = '#00FF9C', height = 120 }) => {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;
  const pointSpacing = (width - 80) / (data.length - 1);
  
  // Create path for smooth curve
  const createPath = () => {
    const points = data.map((value, index) => {
      const x = index * pointSpacing;
      const y = height - 20 - ((value - minValue) / range) * (height - 40);
      return `${x},${y}`;
    });
    
    return points.join(' ');
  };
  
  return (
    <View style={{ height }} className="justify-center px-4">
      {/* Grid lines */}
      <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 20 }}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${(i * 25)}%`,
              height: 1,
              backgroundColor: '#1F2937',
              opacity: 0.5
            }}
          />
        ))}
      </View>
      
      {/* Line */}
      <View style={{ position: 'relative', height: height - 40 }}>
        {data.map((value, index) => {
          const x = index * pointSpacing;
          const y = height - 20 - ((value - minValue) / range) * (height - 40);
          
          return (
            <React.Fragment key={index}>
              {/* Data point */}
              <View
                style={{
                  position: 'absolute',
                  left: x - 4,
                  top: y - 4,
                  width: 8,
                  height: 8,
                  backgroundColor: color,
                  borderRadius: 4,
                  shadowColor: color,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.5,
                  shadowRadius: 3,
                  elevation: 2
                }}
              />
              {/* Value label */}
              <Text
                style={{
                  position: 'absolute',
                  left: x - 10,
                  top: y - 20,
                  color: color,
                  fontSize: 9,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  width: 20
                }}
              >
                {value}
              </Text>
              {/* Connection line to next point */}
              {index < data.length - 1 && (
                <View
                  style={{
                    position: 'absolute',
                    left: x,
                    top: y,
                    width: pointSpacing,
                    height: 2,
                    backgroundColor: color,
                    opacity: 0.7,
                    transform: [
                      { rotate: `${Math.atan2(
                        ((data[index + 1] - value) / range) * (height - 40),
                        pointSpacing
                      ) * 180 / Math.PI}deg` },
                      { translateX: pointSpacing / 2 },
                      { translateY: -1 }
                    ]
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
      
      {/* X-axis labels */}
      <View className="flex-row justify-between w-full mt-2">
        {data.map((_, index) => (
          <Text key={index} className="text-gray-400 text-xs" style={{ fontSize: 10 }}>
            {index + 1}
          </Text>
        ))}
      </View>
    </View>
  );
};

export const PieChart: React.FC<{ data: { name: string; value: number; color: string }[] }> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const size = 120;
  const center = size / 2;
  const radius = center - 10;
  
  return (
    <View className="items-center">
      <View style={{ width: size, height: size }} className="relative items-center justify-center">
        {/* Pie slices */}
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const startAngle = data.slice(0, index).reduce((sum, prev) => sum + (prev.value / total) * 360, 0);
          const endAngle = startAngle + (percentage / 100) * 360;
          
          return (
            <View
              key={index}
              style={{
                position: 'absolute',
                width: size,
                height: size,
                backgroundColor: 'transparent',
                borderRadius: size / 2,
                overflow: 'hidden'
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  width: size,
                  height: size,
                  backgroundColor: item.color,
                  transform: [{ rotate: `${startAngle}deg` }],
                  borderRadius: size / 2,
                  // Create pie slice using clip-path like effect
                  borderTopRightRadius: percentage > 50 ? size / 2 : 0,
                  borderBottomRightRadius: percentage > 50 ? size / 2 : 0,
                }}
              />
            </View>
          );
        })}
        
        {/* Center circle (donut effect) */}
        <View 
          style={{
            position: 'absolute',
            width: size * 0.6,
            height: size * 0.6,
            backgroundColor: '#1F2937',
            borderRadius: (size * 0.6) / 2,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text className="text-neon-green font-bold text-lg" style={{ fontSize: 16 }}>{total}</Text>
          <Text className="text-gray-400 text-xs" style={{ fontSize: 10 }}>Total</Text>
        </View>
      </View>
      
      {/* Legend */}
      <View className="mt-4 space-y-1" style={{ width: size * 1.2 }}>
        {data.map((item, index) => (
          <View key={index} className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View 
                style={{ backgroundColor: item.color }}
                className="w-3 h-3 rounded-full mr-2"
              />
              <Text className="text-gray-300 text-xs" style={{ fontSize: 11 }}>{item.name}</Text>
            </View>
            <Text className="text-gray-400 text-xs" style={{ fontSize: 11 }}>
              {item.value} ({Math.round((item.value / total) * 100)}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export const ProgressRing: React.FC<{ percentage: number; color?: string; size?: number }> = ({ 
  percentage, 
  color = '#00FF9C', 
  size = 80 
}) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <View className="items-center justify-center">
      <View style={{ width: size, height: size }} className="items-center justify-center">
        {/* Background ring */}
        <View 
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: '#374151',
            position: 'absolute'
          }}
        />
        {/* Progress ring */}
        <View 
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: color,
            borderTopColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: 'transparent',
            transform: [{ rotate: '-90deg' }],
            position: 'absolute'
          }}
        />
        {/* Center content */}
        <View className="items-center justify-center">
          <Text className="font-bold text-lg" style={{ color, fontSize: 16 }}>{percentage}%</Text>
          <Text className="text-gray-400 text-xs" style={{ fontSize: 10 }}>Complete</Text>
        </View>
      </View>
    </View>
  );
};

export const Sparkline: React.FC<{ data: number[]; color?: string; positive?: boolean }> = ({ 
  data, 
  color = '#00FF9C',
  positive = true 
}) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 32;
  const pointSpacing = width / (data.length - 1);
  
  const percentageChange = ((data[data.length - 1] - data[0]) / data[0] * 100).toFixed(1);
  
  return (
    <View className="flex-row items-center">
      <View className="flex-1" style={{ width, height }}>
        {/* Background gradient */}
        <View 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: height / 2,
            backgroundColor: positive ? color : '#FF1493',
            opacity: 0.1
          }}
        />
        
        {/* Sparkline */}
        {data.map((value, index) => {
          const x = index * pointSpacing;
          const y = height - ((value - min) / range) * height;
          
          return (
            <React.Fragment key={index}>
              {/* Data point */}
              <View
                style={{
                  position: 'absolute',
                  left: x - 1,
                  top: y - 1,
                  width: 2,
                  height: 2,
                  backgroundColor: positive ? color : '#FF1493',
                  borderRadius: 1
                }}
              />
              {/* Line to next point */}
              {index < data.length - 1 && (
                <View
                  style={{
                    position: 'absolute',
                    left: x,
                    top: y,
                    width: pointSpacing,
                    height: 1,
                    backgroundColor: positive ? color : '#FF1493',
                    opacity: 0.6,
                    transform: [
                      { rotate: `${Math.atan2(
                        (data[index + 1] - value) / range * height,
                        pointSpacing
                      ) * 180 / Math.PI}deg` },
                      { translateX: pointSpacing / 2 }
                    ]
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
        
        {/* Zero line */}
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: height - (min / range) * height,
            height: 1,
            backgroundColor: '#4B5563',
            opacity: 0.3
          }}
        />
      </View>
      
      {/* Percentage indicator */}
      <View className="ml-3 items-center">
        <Text className={`text-xs font-bold ${positive ? 'text-neon-green' : 'text-red-500'}`}>
          {positive ? '+' : ''}{percentageChange}%
        </Text>
        <Text className="text-gray-500 text-xs">
          {data[0]} → {data[data.length - 1]}
        </Text>
      </View>
    </View>
  );
};
