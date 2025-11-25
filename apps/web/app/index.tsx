import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { ExpandableCanvasSection, SectionModal } from '../components/ExpandableCanvasSection';
import ParticleTextLogo from '../components/ParticleTextLogo';
import PDFExport from '../components/PDFExport';
import { useRouter } from 'expo-router';
import { Building2, Activity, Target, Users, Lightbulb, MessageSquare, DollarSign, TrendingUp, Award, ImageIcon, User } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface CanvasSection {
  id: string;
  title: string;
  subtitle: string;
  content: string[];
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const [selectedSection, setSelectedSection] = useState<CanvasSection | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const canvasSections: CanvasSection[] = [
    {
      id: 'partners',
      title: 'Socios Clave',
      subtitle: 'Alianzas externas que ayudan a ejecutar las actividades clave',
      content: [
        'ONGs Ambientales - Colaboración con 15+ organizaciones líderes en conservación',
        'Proyectos de Compensación de Carbono - 50+ proyectos verificados por Verra y Gold Standard',
        'Validadores Blockchain - Auditoría y certificación por 8+ firmas especializadas',
        'Proveedores de Energía Verde - Contratos con 20+ generadores de energía renovable',
        'Consultores de Sostenibilidad - Equipo de 30+ expertos en ESG y carbon neutrality',
        'Organizaciones de Impacto - Partnerships con 25+ ONGs internacionales'
      ],
      metrics: {
        kpi: '95% tasa de retención de partners',
        growth: '+180% crecimiento anual',
        efficiency: '85% reducción costos operativos',
        target: '200+ partners para 2025'
      },
      chartData: {
        bar: [65, 72, 68, 80, 85, 92],
        line: [45, 52, 48, 65, 72, 88],
        pie: [
          { name: 'ONGs', value: 30, color: '#00FF9C' },
          { name: 'Carbono', value: 25, color: '#FF1493' },
          { name: 'Blockchain', value: 20, color: '#FFD700' },
          { name: 'Energía', value: 25, color: '#8B5CF6' }
        ],
        sparklines: {
          adoption: [8, 12, 15, 18, 25, 32],
          costs: [100, 92, 88, 85, 82, 78]
        }
      },
      icon: <Building2 size={24} color="#00FF9C" />,
      color: 'text-neon-green',
      bgColor: 'bg-gradient-to-br from-space-dark to-space-darker',
      borderColor: 'border-neon-green/40'
    },
    {
      id: 'activities',
      title: 'Actividades Clave',
      subtitle: 'Las actividades más importantes para ejecutar la propuesta de valor',
      content: [
        'Verificación de Impacto - Procesamiento de 1000+ verificaciones mensuales con IA',
        'Acuñación y Comercio de NFTs - Emisión de 5000+ NFTs de carbono verificados',
        'Desarrollo de Smart Contracts - 50+ contratos desplegados en Ethereum/Polygon',
        'Gestión Comunitaria - Moderación de 10000+ miembros en Discord/Telegram',
        'Gestión de Créditos de Carbono - Administración de 1M+ toneladas CO2e',
        'Análisis de Datos - Procesamiento de 5TB+ de datos con ML/AI'
      ],
      metrics: {
        kpi: '99.9% uptime del sistema',
        growth: '+300% procesamiento transacciones',
        efficiency: '2.3x mejora en velocidad',
        target: '10M+ transacciones/año'
      },
      chartData: {
        bar: [120, 135, 158, 172, 195, 210],
        line: [80, 95, 110, 125, 145, 165],
        pie: [
          { name: 'Verificación', value: 35, color: '#00FF9C' },
          { name: 'NFTs', value: 25, color: '#FF1493' },
          { name: 'Smart Contracts', value: 20, color: '#FFD700' },
          { name: 'Comunidad', value: 20, color: '#8B5CF6' }
        ],
        sparklines: {
          adoption: [15, 22, 28, 35, 42, 48],
          costs: [120, 115, 108, 102, 98, 95]
        }
      },
      icon: <Activity size={24} color="#00FF9C" />,
      color: 'text-neon-green',
      bgColor: 'bg-gradient-to-br from-space-dark to-space-darker',
      borderColor: 'border-neon-green/40'
    },
    {
      id: 'proposition',
      title: 'Propuesta de Valor',
      subtitle: 'Producto o servicio único que crea valor para los clientes',
      content: [
        'Seguimiento Transparente de Impacto - Blockchain inmutable con trazabilidad completa',
        'Créditos de Carbono Basados en Web3 - Tokenización real con estándares UNFCCC',
        'Sostenibilidad Gamificada - 85% engagement con sistema de niveles y recompensas',
        'Sistema de Logros NFT - 100+ logros desbloqueables con rareza variable',
        'Verificación Descentralizada - Consenso distribuido con Proof-of-Stake',
        'Dashboards en Tiempo Real - Actualización instantánea con WebSockets'
      ],
      metrics: {
        kpi: '4.8/5 satisfacción usuarios',
        growth: '+450% adopción mensual',
        efficiency: '90% reducción fraudes',
        target: '1M+ usuarios activos'
      },
      chartData: {
        bar: [88, 92, 95, 98, 102, 108],
        line: [60, 75, 85, 92, 98, 105],
        pie: [
          { name: 'Transparencia', value: 30, color: '#00FF9C' },
          { name: 'Web3', value: 25, color: '#FF1493' },
          { name: 'Gamificación', value: 25, color: '#FFD700' },
          { name: 'Dashboards', value: 20, color: '#8B5CF6' }
        ],
        sparklines: {
          adoption: [25, 35, 48, 62, 78, 95],
          costs: [80, 75, 70, 65, 62, 58]
        }
      },
      icon: <Target size={24} color="#00FF9C" />,
      color: 'text-neon-green',
      bgColor: 'bg-gradient-to-br from-space-dark to-space-darker',
      borderColor: 'border-neon-green/40'
    },
    {
      id: 'relationships',
      title: 'Relaciones con Clientes',
      subtitle: 'Tipos de relaciones establecidas con los segmentos de clientes',
      content: [
        'Construcción Comunitaria - 50+ eventos mensuales con 500+ asistentes',
        'Dashboard de Análisis de Impacto - Personalización con IA y recomendaciones',
        'Recomendaciones Personalizadas - 95% precisión con algoritmos ML',
        'Sistema de Logros - Gamificación con 50+ niveles y badges exclusivos',
        'Funciones de Compartir Social - 10K+ compartidos diarios en redes',
        'Soporte 24/7 - <2min tiempo respuesta con chatbots y agentes'
      ],
      metrics: {
        kpi: '92% tasa de retención',
        growth: '+250% NPS score',
        efficiency: '80% soporte automatizado',
        target: '95% satisfacción'
      },
      chartData: {
        bar: [78, 82, 86, 90, 94, 98],
        line: [65, 72, 78, 85, 89, 94],
        pie: [
          { name: 'Comunidad', value: 35, color: '#00FF9C' },
          { name: 'Dashboards', value: 25, color: '#FF1493' },
          { name: 'Logros', value: 20, color: '#FFD700' },
          { name: 'Soporte', value: 20, color: '#8B5CF6' }
        ],
        sparklines: {
          adoption: [18, 25, 32, 40, 48, 55],
          costs: [90, 85, 82, 78, 75, 72]
        }
      },
      icon: <Users size={24} color="#00FF9C" />,
      color: 'text-neon-green',
      bgColor: 'bg-gradient-to-br from-space-dark to-space-darker',
      borderColor: 'border-neon-green/40'
    },
    {
      id: 'segments',
      title: 'Segmentos de Clientes',
      subtitle: 'Diferentes grupos de personas u organizaciones objetivo',
      content: [
        'Individuos Eco-conscientes - 45% del mercado con ingresos >$50K anuales',
        'Equipos de Sostenibilidad Corporativa - 200+ empresas Fortune 500',
        'Organizaciones Ambientales - 500+ ONGs con presupuesto >$1M',
        'Entusiastas de Web3 - 100K+ usuarios con wallets activas',
        'Inversores de Impacto - $50M+ en activos bajo gestión',
        'Proyectos Educativos - 100+ instituciones K-12 y universidades'
      ],
      metrics: {
        kpi: '35% penetración mercado',
        growth: '+400% nuevos segmentos',
        efficiency: '$25 LTV promedio',
        target: '5M+ usuarios totales'
      },
      chartData: {
        bar: [55, 62, 68, 75, 82, 88],
        line: [40, 48, 55, 62, 70, 78],
        pie: [
          { name: 'Eco-conscientes', value: 35, color: '#00FF9C' },
          { name: 'Corporativo', value: 25, color: '#FF1493' },
          { name: 'ONGs', value: 20, color: '#FFD700' },
          { name: 'Web3', value: 20, color: '#8B5CF6' }
        ],
        sparklines: {
          adoption: [12, 18, 25, 32, 40, 48],
          costs: [70, 68, 65, 62, 60, 58]
        }
      },
      icon: <Users size={24} color="#00FF9C" />,
      color: 'text-neon-green',
      bgColor: 'bg-gradient-to-br from-space-dark to-space-darker',
      borderColor: 'border-neon-green/40'
    },
    {
      id: 'resources',
      title: 'Recursos Clave',
      subtitle: 'Principales recursos necesarios para ejecutar las actividades clave',
      content: [
        'Infraestructura Blockchain - 15 nodos globales con 99.9% uptime',
        'Base de Código Smart Contracts - 200K+ líneas con auditorías completas',
        'Alianzas de Compensación de Carbono - 50+ partners verificados',
        'Plataforma Comunitaria - 100K+ MAU con engagement del 45%',
        'Sistemas de Análisis de Datos - Pipeline ML/AI con TensorFlow',
        'Equipo Técnico Experto - 50+ desarrolladores senior y blockchain engineers'
      ],
      metrics: {
        kpi: '300% ROI en infraestructura',
        growth: '+200% capacidad procesamiento',
        efficiency: '95% utilización recursos',
        target: '100+ desarrolladores'
      },
      chartData: {
        bar: [92, 98, 105, 112, 118, 125],
        line: [70, 78, 85, 92, 98, 105],
        pie: [
          { name: 'Blockchain', value: 30, color: '#00FF9C' },
          { name: 'Código', value: 25, color: '#FF1493' },
          { name: 'Comunidad', value: 25, color: '#FFD700' },
          { name: 'Equipo', value: 20, color: '#8B5CF6' }
        ],
        sparklines: {
          adoption: [20, 28, 35, 42, 50, 58],
          costs: [110, 105, 100, 95, 92, 88]
        }
      },
      icon: <Lightbulb size={24} color="#00FF9C" />,
      color: 'text-neon-green',
      bgColor: 'bg-gradient-to-br from-space-dark to-space-darker',
      borderColor: 'border-neon-green/40'
    },
    {
      id: 'channels',
      title: 'Canales',
      subtitle: 'Cómo las propuestas de valor llegan a los segmentos de clientes',
      content: [
        'App Móvil (iOS/Android) - 150K+ descargas con 4.5★ rating',
        'Plataforma Web - 300K+ visitantes/mes con 12% conversión',
        'Campañas en Redes Sociales - 1M+ alcance con 3.2% engagement',
        'Redes de Partners - 50+ canales activos con comisiones variables',
        'Eventos Comunitarios - 20+ eventos/mes con 500+ asistentes',
        'Marketing de Contenidos - 200+ artículos con 50K+ lectores'
      ],
      metrics: {
        kpi: '12% tasa conversión',
        growth: '+350% tráfico orgánico',
        efficiency: '$2.5 CPA promedio',
        target: '500K+ usuarios totales'
      },
      chartData: {
        bar: [68, 75, 82, 88, 94, 102],
        line: [50, 58, 65, 72, 80, 88],
        pie: [
          { name: 'Mobile', value: 35, color: '#00FF9C' },
          { name: 'Web', value: 25, color: '#FF1493' },
          { name: 'Social', value: 25, color: '#FFD700' },
          { name: 'Eventos', value: 15, color: '#8B5CF6' }
        ],
        sparklines: {
          adoption: [15, 22, 30, 38, 46, 55],
          costs: [85, 82, 78, 75, 72, 68]
        }
      },
      icon: <MessageSquare size={24} color="#00FF9C" />,
      color: 'text-neon-green',
      bgColor: 'bg-gradient-to-br from-space-dark to-space-darker',
      borderColor: 'border-neon-green/40'
    },
    {
      id: 'costs',
      title: 'Estructura de Costos',
      subtitle: 'Todos los costos involucrados en operar el modelo de negocio',
      content: [
        'Tarifas Gas de Blockchain - 15% del total con optimización Layer 2',
        'Desarrollo de Plataforma - 25% del total con 50+ desarrolladores',
        'Marketing y Comunidad - 20% del total con ROI de 3.2x',
        'Gestión de Partnerships - 10% del total con 50+ alianzas activas',
        'Cumplimiento y Auditoría - 8% del total con certificaciones ISO',
        'Infraestructura Técnica - 22% del total con cloud providers'
      ],
      metrics: {
        kpi: '$2.5M burn rate anual',
        growth: '+180% optimización costos',
        efficiency: '30% reducción vs industria',
        target: '$1.8M burn rate'
      },
      chartData: {
        bar: [45, 42, 38, 35, 32, 28],
        line: [60, 55, 50, 45, 40, 35],
        pie: [
          { name: 'Plataforma', value: 25, color: '#00FF9C' },
          { name: 'Infraestructura', value: 22, color: '#FF1493' },
          { name: 'Marketing', value: 20, color: '#FFD700' },
          { name: 'Gas', value: 15, color: '#8B5CF6' }
        ],
        sparklines: {
          adoption: [100, 95, 88, 82, 75, 68],
          costs: [100, 95, 90, 85, 80, 75]
        }
      },
      icon: <DollarSign size={24} color="#00FF9C" />,
      color: 'text-neon-green',
      bgColor: 'bg-gradient-to-br from-space-dark to-space-darker',
      borderColor: 'border-neon-green/40'
    },
    {
      id: 'revenue',
      title: 'Fuentes de Ingresos',
      subtitle: 'Fuentes desde las cuales la empresa genera dinero',
      content: [
        'Comisiones de Acuñación NFT - 35% de ingresos con 2.5% fee',
        'Comisiones de Transacciones - 25% de ingresos con 1% fee',
        'Análisis Premium - 15% de ingresos con $49/mes suscripción',
        'Partnerships Corporativas - 15% de ingresos con contratos anuales',
        'Trading de Créditos de Carbono - 5% de ingresos con 0.5% spread',
        'Suscripciones Pro - 5% de ingresos con $99/mes plan'
      ],
      metrics: {
        kpi: '$5M+ ARR anual',
        growth: '+600% crecimiento ingresos',
        efficiency: '75% margen bruto',
        target: '$10M+ ARR'
      },
      chartData: {
        bar: [125, 145, 168, 195, 225, 258],
        line: [80, 95, 115, 135, 160, 185],
        pie: [
          { name: 'NFTs', value: 35, color: '#00FF9C' },
          { name: 'Transacciones', value: 25, color: '#FF1493' },
          { name: 'Premium', value: 15, color: '#FFD700' },
          { name: 'Partnerships', value: 15, color: '#8B5CF6' }
        ],
        sparklines: {
          adoption: [30, 45, 62, 78, 95, 112],
          costs: [60, 58, 55, 52, 50, 48]
        }
      },
      icon: <DollarSign size={24} color="#00FF9C" />,
      color: 'text-neon-green',
      bgColor: 'bg-gradient-to-br from-space-dark to-space-darker',
      borderColor: 'border-neon-green/40'
    }
  ];

  const handleSectionPress = (section: CanvasSection) => {
    setSelectedSection(section);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedSection(null);
  };

  return (
    <View className="flex-1 bg-gradient-to-b from-deep-space to-space-dark">
      {/* Navigation Only - No Logo */}
      <View className="flex-row justify-center space-x-4 mt-4 px-6">
        <TouchableOpacity 
          className="bg-neon-green/20 p-3 rounded-2xl border border-neon-green/50"
          onPress={() => router.push("/profile")}
        >
          <User size={20} color="#00FF9C" />
        </TouchableOpacity>
        <TouchableOpacity 
          className="bg-neon-green/20 p-3 rounded-2xl border border-neon-green/50"
          onPress={() => router.push("/impact")}
        >
          <TrendingUp size={20} color="#00FF9C" />
        </TouchableOpacity>
        <TouchableOpacity 
          className="bg-neon-green/20 p-3 rounded-2xl border border-neon-green/50"
          onPress={() => router.push("/nfts")}
        >
          <ImageIcon size={20} color="#00FF9C" />
        </TouchableOpacity>
      </View>

      {/* Canvas Grid */}
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-4">
        {/* Floating Download Button */}
        <View className="absolute top-4 right-4 z-10">
          <PDFExport />
        </View>
        
        {/* Top Row */}
        <View className="flex-row mb-6" style={{ height: 160 }}>
          <ExpandableCanvasSection
            section={canvasSections[0]}
            index={0}
            onPress={handleSectionPress}
          />
          <ExpandableCanvasSection
            section={canvasSections[1]}
            index={1}
            onPress={handleSectionPress}
          />
          <ExpandableCanvasSection
            section={canvasSections[2]}
            index={2}
            onPress={handleSectionPress}
          />
        </View>

        {/* Middle Row */}
        <View className="flex-row mb-6" style={{ height: 160 }}>
          <ExpandableCanvasSection
            section={canvasSections[3]}
            index={3}
            onPress={handleSectionPress}
          />
          <ExpandableCanvasSection
            section={canvasSections[4]}
            index={4}
            onPress={handleSectionPress}
          />
          <ExpandableCanvasSection
            section={canvasSections[5]}
            index={5}
            onPress={handleSectionPress}
          />
        </View>

        {/* Bottom Row */}
        <View className="flex-row mb-6" style={{ height: 160 }}>
          <ExpandableCanvasSection
            section={canvasSections[6]}
            index={6}
            onPress={handleSectionPress}
          />
          <ExpandableCanvasSection
            section={canvasSections[7]}
            index={7}
            onPress={handleSectionPress}
          />
          <ExpandableCanvasSection
            section={canvasSections[8]}
            index={8}
            onPress={handleSectionPress}
          />
        </View>

        {/* Summary Card */}
        <View className="bg-gradient-to-br from-space-dark to-space-darker border-2 border-neon-green/40 rounded-3xl p-4 mb-8">
          <View className="flex-row items-center mb-3">
            <View className="bg-neon-green/10 p-2 rounded-2xl border border-neon-green/30">
              <TrendingUp size={24} color="#00FF9C" />
            </View>
            <Text className="text-neon-green text-lg font-bold ml-3">
              Visión Estratégica
            </Text>
          </View>
          <View className="bg-neon-green/10 p-4 rounded-xl border border-neon-green/30 w-full max-w-md">
            <View className="space-y-3">
              <View className="flex-row items-center">
                <Target size={16} color="#00FF9C" className="mr-3" />
                <Text className="text-gray-300 text-sm flex-1">
                  Impacto ambiental medible y verificable
                </Text>
              </View>
              <View className="flex-row items-center">
                <TrendingUp size={16} color="#00FF9C" className="mr-3" />
                <Text className="text-gray-300 text-sm flex-1">
                  Crecimiento exponencial con Web3
                </Text>
              </View>
              <View className="flex-row items-center">
                <Award size={16} color="#00FF9C" className="mr-3" />
                <Text className="text-gray-300 text-sm flex-1">
                  Liderazgo en sostenibilidad digital
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Section Modal */}
      <SectionModal
        visible={modalVisible}
        section={selectedSection}
        onClose={handleCloseModal}
      />
    </View>
  );
}
