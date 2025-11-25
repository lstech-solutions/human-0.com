import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { ArrowLeft, Users, Target, Lightbulb, Activity, DollarSign, MessageSquare, Building2, TrendingUp, Award } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import PDFExport from '../components/PDFExport';

const { width, height } = Dimensions.get('window');

interface CanvasBlock {
  id: string;
  title: string;
  subtitle: string;
  content: string[];
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

export default function CanvasScreen() {
  const router = useRouter();
  const [blockAnimations, setBlockAnimations] = useState<{ [key: string]: Animated.Value }>({});
  const [titleAnim] = useState(new Animated.Value(0));
  const [subtitleAnim] = useState(new Animated.Value(0));

  const canvasBlocks: CanvasBlock[] = [
    {
      id: 'partners',
      title: 'Socios Clave',
      subtitle: 'Alianzas estratégicas',
      content: [
        'ONGs Ambientales',
        'Proyectos de Compensación de Carbono',
        'Validadores Blockchain',
        'Proveedores de Energía Verde',
        'Consultores de Sostenibilidad',
        'Organizaciones de Impacto'
      ],
      icon: <Building2 size={28} color="#00FF9C" />,
      color: 'text-neon-green',
      bgColor: 'bg-gradient-to-br from-space-dark to-space-darker',
      borderColor: 'border-neon-green/40'
    },
    {
      id: 'activities',
      title: 'Actividades Clave',
      subtitle: 'Operaciones principales',
      content: [
        'Verificación de Impacto',
        'Acuñación y Comercio de NFTs',
        'Desarrollo de Smart Contracts',
        'Gestión Comunitaria',
        'Gestión de Créditos de Carbono',
        'Análisis de Datos'
      ],
      icon: <Activity size={28} color="#00FF9C" />,
      color: 'text-neon-green',
      bgColor: 'bg-gradient-to-br from-space-dark to-space-darker',
      borderColor: 'border-neon-green/40'
    },
    {
      id: 'proposition',
      title: 'Propuesta de Valor',
      subtitle: 'Oferta única',
      content: [
        'Seguimiento Transparente de Impacto',
        'Créditos de Carbono Basados en Web3',
        'Sostenibilidad Gamificada',
        'Sistema de Logros NFT',
        'Verificación Descentralizada',
        'Dashboards en Tiempo Real'
      ],
      icon: <Target size={28} color="#00FF9C" />,
      color: 'text-neon-green',
      bgColor: 'bg-gradient-to-br from-space-dark to-space-darker',
      borderColor: 'border-neon-green/40'
    },
    {
      id: 'relationships',
      title: 'Relaciones con Clientes',
      subtitle: 'Interacción y retención',
      content: [
        'Construcción Comunitaria',
        'Dashboard de Análisis de Impacto',
        'Recomendaciones Personalizadas',
        'Sistema de Logros',
        'Funciones de Compartir Social',
        'Soporte 24/7'
      ],
      icon: <Users size={28} color="#00FF9C" />,
      color: 'text-neon-green',
      bgColor: 'bg-gradient-to-br from-space-dark to-space-darker',
      borderColor: 'border-neon-green/40'
    },
    {
      id: 'segments',
      title: 'Segmentos de Clientes',
      subtitle: 'Público objetivo',
      content: [
        'Individuos Eco-conscientes',
        'Equipos de Sostenibilidad Corporativa',
        'Organizaciones Ambientales',
        'Entusiastas de Web3',
        'Inversores de Impacto',
        'Proyectos Educativos'
      ],
      icon: <Users size={28} color="#00FF9C" />,
      color: 'text-neon-green',
      bgColor: 'bg-gradient-to-br from-space-dark to-space-darker',
      borderColor: 'border-neon-green/40'
    },
    {
      id: 'resources',
      title: 'Recursos Clave',
      subtitle: 'Activos estratégicos',
      content: [
        'Infraestructura Blockchain',
        'Base de Código Smart Contracts',
        'Alianzas de Compensación de Carbono',
        'Plataforma Comunitaria',
        'Sistemas de Análisis de Datos',
        'Equipo Técnico Experto'
      ],
      icon: <Lightbulb size={28} color="#00FF9C" />,
      color: 'text-neon-green',
      bgColor: 'bg-gradient-to-br from-space-dark to-space-darker',
      borderColor: 'border-neon-green/40'
    },
    {
      id: 'channels',
      title: 'Canales',
      subtitle: 'Distribución',
      content: [
        'App Móvil (iOS/Android)',
        'Plataforma Web',
        'Campañas en Redes Sociales',
        'Redes de Partners',
        'Eventos Comunitarios',
        'Marketing de Contenidos'
      ],
      icon: <MessageSquare size={28} color="#00FF9C" />,
      color: 'text-neon-green',
      bgColor: 'bg-gradient-to-br from-space-dark to-space-darker',
      borderColor: 'border-neon-green/40'
    },
    {
      id: 'costs',
      title: 'Estructura de Costos',
      subtitle: 'Inversiones necesarias',
      content: [
        'Tarifas Gas de Blockchain',
        'Desarrollo de Plataforma',
        'Marketing y Comunidad',
        'Gestión de Partnerships',
        'Cumplimiento y Auditoría',
        'Infraestructura Técnica'
      ],
      icon: <DollarSign size={28} color="#00FF9C" />,
      color: 'text-neon-green',
      bgColor: 'bg-gradient-to-br from-space-dark to-space-darker',
      borderColor: 'border-neon-green/40'
    },
    {
      id: 'revenue',
      title: 'Fuentes de Ingresos',
      subtitle: 'Monetización',
      content: [
        'Comisiones de Acuñación NFT',
        'Comisiones de Transacciones',
        'Análisis Premium',
        'Partnerships Corporativas',
        'Trading de Créditos de Carbono',
        'Suscripciones Pro'
      ],
      icon: <DollarSign size={28} color="#00FF9C" />,
      color: 'text-neon-green',
      bgColor: 'bg-gradient-to-br from-space-dark to-space-darker',
      borderColor: 'border-neon-green/40'
    }
  ];

  useEffect(() => {
    // Animate title
    Animated.timing(titleAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Animate subtitle
    Animated.timing(subtitleAnim, {
      toValue: 1,
      duration: 800,
      delay: 200,
      useNativeDriver: true,
    }).start();

    // Initialize block animations
    const animations: { [key: string]: Animated.Value } = {};
    canvasBlocks.forEach((block, index) => {
      animations[block.id] = new Animated.Value(0);
    });
    setBlockAnimations(animations);

    // Animate blocks in sequence with staggered timing
    canvasBlocks.forEach((block, index) => {
      setTimeout(() => {
        if (animations[block.id]) {
          Animated.spring(animations[block.id], {
            toValue: 1,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          }).start();
        }
      }, 600 + index * 120);
    });
  }, []);

  const renderCanvasBlock = (block: CanvasBlock, index: number) => {
    const animValue = blockAnimations[block.id];
    if (!animValue) return null;

    const translateY = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [60, 0],
    });

    const opacity = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    const scale = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.85, 1],
    });

    return (
      <Animated.View
        key={block.id}
        style={{
          transform: [{ translateY }, { scale }],
          opacity,
        }}
        className={`${block.bgColor} ${block.borderColor} border-2 rounded-3xl p-5 m-2 flex-1 min-h-[160px] shadow-2xl`}
      >
        <View className="flex-row items-start mb-4">
          <View className="bg-neon-green/10 p-3 rounded-2xl border border-neon-green/30">
            {block.icon}
          </View>
          <View className="ml-4 flex-1">
            <Text className={`${block.color} font-bold text-lg mb-1`}>
              {block.title}
            </Text>
            <Text className="text-gray-400 text-xs">
              {block.subtitle}
            </Text>
          </View>
        </View>
        <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false} className="flex-1">
          {block.content.map((item, itemIndex) => (
            <View key={itemIndex} className="flex-row mb-2 items-start">
              <View className="w-1 h-1 bg-neon-green rounded-full mt-2 mr-3" />
              <Text className="text-gray-300 text-xs flex-1 leading-relaxed">
                {item}
              </Text>
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    );
  };

  return (
    <View className="flex-1 bg-gradient-to-b from-deep-space to-space-dark">
      {/* Header with Glass Effect */}
      <View className="px-6 pt-12 pb-6">
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity 
            onPress={() => router.push('/')} 
            className="bg-space-dark/50 backdrop-blur-lg p-3 rounded-2xl border border-neon-green/30"
          >
            <ArrowLeft size={24} color="#00FF9C" />
          </TouchableOpacity>
          
          {/* Center - HUMΛN-Ø Title */}
          <TouchableOpacity 
            onPress={() => router.push('/')}
            className="flex-1 items-center justify-center"
          >
            <Text className="text-neon-green text-2xl font-bold tracking-wider">
              HUMΛN-Ø
            </Text>
          </TouchableOpacity>
          
          <PDFExport position="navigation" />
        </View>
        
        <Animated.View style={{ opacity: subtitleAnim }} className="items-center">
          <Text className="text-gray-400 text-sm text-center max-w-sm leading-relaxed">
            Canvas del Modelo de Negocio
          </Text>
        </Animated.View>
      </View>

      {/* Canvas Grid */}
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-4">
        {/* Top Row */}
        <View className="flex-row mb-3" style={{ height: 200 }}>
          <View className="flex-1 mr-2">
            {renderCanvasBlock(canvasBlocks[0], 0)}
          </View>
          <View className="flex-1 mr-2">
            {renderCanvasBlock(canvasBlocks[1], 1)}
          </View>
          <View className="flex-1">
            {renderCanvasBlock(canvasBlocks[2], 2)}
          </View>
        </View>

        {/* Middle Row */}
        <View className="flex-row mb-3" style={{ height: 200 }}>
          <View className="flex-1 mr-2">
            {renderCanvasBlock(canvasBlocks[3], 3)}
          </View>
          <View className="flex-1 mr-2">
            {renderCanvasBlock(canvasBlocks[4], 4)}
          </View>
          <View className="flex-1">
            {renderCanvasBlock(canvasBlocks[5], 5)}
          </View>
        </View>

        {/* Bottom Row */}
        <View className="flex-row mb-6" style={{ height: 200 }}>
          <View className="flex-1 mr-2">
            {renderCanvasBlock(canvasBlocks[6], 6)}
          </View>
          <View className="flex-1 mr-2">
            {renderCanvasBlock(canvasBlocks[7], 7)}
          </View>
          <View className="flex-1">
            {renderCanvasBlock(canvasBlocks[8], 8)}
          </View>
        </View>

        {/* Summary Card */}
        <Animated.View 
          style={{ opacity: subtitleAnim }}
          className="bg-gradient-to-br from-space-dark to-space-darker border-2 border-neon-green/40 rounded-3xl p-6 mb-8"
        >
          <View className="flex-row items-center mb-4">
            <View className="bg-neon-green/10 p-3 rounded-2xl border border-neon-green/30">
              <TrendingUp size={28} color="#00FF9C" />
            </View>
            <Text className="text-neon-green text-xl font-bold ml-4">
              Visión Estratégica
            </Text>
          </View>
          
          <Text className="text-gray-300 text-sm leading-relaxed mb-4">
            HUMΛN-Ø integra tecnología blockchain con sostenibilidad ambiental para crear un ecosistema transparente de compensación de carbono. Nuestro modelo combina gamificación, recompensas NFT y verificación descentralizada para democratizar el acceso a la neutralidad climática.
          </Text>
          
          <View className="flex-row items-center justify-center space-x-4">
            <View className="items-center">
              <Award size={24} color="#00FF9C" />
              <Text className="text-gray-400 text-xs mt-1">Impacto</Text>
            </View>
            <View className="items-center">
              <Target size={24} color="#00FF9C" />
              <Text className="text-gray-400 text-xs mt-1">Transparencia</Text>
            </View>
            <View className="items-center">
              <Users size={24} color="#00FF9C" />
              <Text className="text-gray-400 text-xs mt-1">Comunidad</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
