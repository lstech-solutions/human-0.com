import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { ExpandableCanvasSection, SectionModal, CanvasSection } from '../components/ExpandableCanvasSection';
import ParticleTextLogo from '../components/ParticleTextLogo';
import PDFExport from '../components/PDFExport';
import { ManifestoModal, useManifestoModal } from '../components/ManifestoModal';
import { useRouter } from 'expo-router';
import { Building2, Activity, Target, Users, Lightbulb, MessageSquare, DollarSign, TrendingUp, Award, ImageIcon, User, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useTranslation } from '@human-0/i18n';

const { width, height } = Dimensions.get('window');

export default function CanvasScreen() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const { t } = useTranslation();
  const isDark = colorScheme === 'dark';
  const containerBgClass = isDark
    ? 'bg-gradient-to-b from-deep-space to-space-dark'
    : 'bg-gradient-to-b from-white to-slate-100';
  const headerTextAccentClass = isDark ? 'text-human-primary' : 'text-emerald-800';
  const sectionTitleColorClass = isDark ? 'text-human-primary' : 'text-emerald-900';
  const summaryTitleColorClass = isDark ? 'text-human-primary' : 'text-emerald-800';
  const [selectedSection, setSelectedSection] = useState<CanvasSection | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { showModal: showManifesto, closeModal: closeManifesto, checked: manifestoChecked } = useManifestoModal();

  // Normalize i18n content for partners section into a proper string[]
  const rawPartnersContent = t('canvas.sections.partners.content', {
    returnObjects: true,
  });
  const partnersContent: string[] = Array.isArray(rawPartnersContent)
    ? rawPartnersContent
    : Object.values(rawPartnersContent as Record<string, string>);

  // Normalize i18n content for activities section into a proper string[]
  const rawActivitiesContent = t('canvas.sections.activities.content', {
    returnObjects: true,
  });
  const activitiesContent: string[] = Array.isArray(rawActivitiesContent)
    ? rawActivitiesContent
    : Object.values(rawActivitiesContent as Record<string, string>);

  // Normalize i18n content for value proposition section into a proper string[]
  const rawPropositionContent = t('canvas.sections.proposition.content', {
    returnObjects: true,
  });
  const propositionContent: string[] = Array.isArray(rawPropositionContent)
    ? rawPropositionContent
    : Object.values(rawPropositionContent as Record<string, string>);

  // Normalize i18n content for customer relationships section into a proper string[]
  const rawRelationshipsContent = t('canvas.sections.relationships.content', {
    returnObjects: true,
  });
  const relationshipsContent: string[] = Array.isArray(rawRelationshipsContent)
    ? rawRelationshipsContent
    : Object.values(rawRelationshipsContent as Record<string, string>);

  // Normalize i18n content for customer segments section into a proper string[]
  const rawSegmentsContent = t('canvas.sections.segments.content', {
    returnObjects: true,
  });
  const segmentsContent: string[] = Array.isArray(rawSegmentsContent)
    ? rawSegmentsContent
    : Object.values(rawSegmentsContent as Record<string, string>);

  // Normalize i18n content for channels section into a proper string[]
  const rawChannelsContent = t('canvas.sections.channels.content', {
    returnObjects: true,
  });
  const channelsContent: string[] = Array.isArray(rawChannelsContent)
    ? rawChannelsContent
    : Object.values(rawChannelsContent as Record<string, string>);

  const canvasSections: CanvasSection[] = [
    {
      id: 'partners',
      title: t('canvas.sections.partners.title'),
      subtitle: t('canvas.sections.partners.subtitle'),
      content: partnersContent,
      metrics: {
        kpi: t('canvas.sections.partners.metrics.kpi'),
        growth: t('canvas.sections.partners.metrics.growth'),
        efficiency: t('canvas.sections.partners.metrics.efficiency'),
        target: t('canvas.sections.partners.metrics.target'),
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
      color: sectionTitleColorClass,
      bgColor: 'bg-gradient-to-br from-space-dark to-space-darker',
      borderColor: 'border-neon-green/40'
    },
    {
      id: 'activities',
      title: t('canvas.sections.activities.title'),
      subtitle: t('canvas.sections.activities.subtitle'),
      content: activitiesContent,
      metrics: {
        kpi: t('canvas.sections.activities.metrics.kpi'),
        growth: t('canvas.sections.activities.metrics.growth'),
        efficiency: t('canvas.sections.activities.metrics.efficiency'),
        target: t('canvas.sections.activities.metrics.target'),
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
      color: sectionTitleColorClass,
      bgColor: 'bg-gradient-to-br from-space-dark to-space-darker',
      borderColor: 'border-neon-green/40'
    },
    {
      id: 'proposition',
      title: t('canvas.sections.proposition.title'),
      subtitle: t('canvas.sections.proposition.subtitle'),
      content: propositionContent,
      metrics: {
        kpi: t('canvas.sections.proposition.metrics.kpi'),
        growth: t('canvas.sections.proposition.metrics.growth'),
        efficiency: t('canvas.sections.proposition.metrics.efficiency'),
        target: t('canvas.sections.proposition.metrics.target'),
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
      color: sectionTitleColorClass,
      bgColor: 'bg-gradient-to-br from-space-dark to-space-darker',
      borderColor: 'border-neon-green/40'
    },
    {
      id: 'relationships',
      title: t('canvas.sections.relationships.title'),
      subtitle: t('canvas.sections.relationships.subtitle'),
      content: relationshipsContent,
      metrics: {
        kpi: t('canvas.sections.relationships.metrics.kpi'),
        growth: t('canvas.sections.relationships.metrics.growth'),
        efficiency: t('canvas.sections.relationships.metrics.efficiency'),
        target: t('canvas.sections.relationships.metrics.target'),
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
      color: sectionTitleColorClass,
      bgColor: 'bg-gradient-to-br from-space-dark to-space-darker',
      borderColor: 'border-neon-green/40'
    },
    {
      id: 'segments',
      title: t('canvas.sections.segments.title'),
      subtitle: t('canvas.sections.segments.subtitle'),
      content: segmentsContent,
      metrics: {
        kpi: t('canvas.sections.segments.metrics.kpi'),
        growth: t('canvas.sections.segments.metrics.growth'),
        efficiency: t('canvas.sections.segments.metrics.efficiency'),
        target: t('canvas.sections.segments.metrics.target'),
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
      color: sectionTitleColorClass,
      bgColor: 'bg-gradient-to-br from-space-dark to-space-darker',
      borderColor: 'border-neon-green/40'
    },
    {
      id: 'resources',
      title: t('canvas.sections.resources.title'),
      subtitle: t('canvas.sections.resources.subtitle'),
      content: t('canvas.sections.resources.content', {
        returnObjects: true,
      }) as string[],
      metrics: {
        kpi: t('canvas.sections.resources.metrics.kpi'),
        growth: t('canvas.sections.resources.metrics.growth'),
        efficiency: t('canvas.sections.resources.metrics.efficiency'),
        target: t('canvas.sections.resources.metrics.target'),
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
      color: sectionTitleColorClass,
      bgColor: 'bg-gradient-to-br from-space-dark to-space-darker',
      borderColor: 'border-neon-green/40'
    },
    {
      id: 'channels',
      title: t('canvas.sections.channels.title'),
      subtitle: t('canvas.sections.channels.subtitle'),
      content: channelsContent,
      metrics: {
        kpi: t('canvas.sections.channels.metrics.kpi'),
        growth: t('canvas.sections.channels.metrics.growth'),
        efficiency: t('canvas.sections.channels.metrics.efficiency'),
        target: t('canvas.sections.channels.metrics.target'),
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
      color: sectionTitleColorClass,
      bgColor: 'bg-gradient-to-br from-space-dark to-space-darker',
      borderColor: 'border-neon-green/40'
    },
    {
      id: 'costs',
      title: t('canvas.sections.costs.title'),
      subtitle: t('canvas.sections.costs.subtitle'),
      content: t('canvas.sections.costs.content', {
        returnObjects: true,
      }) as string[],
      metrics: {
        kpi: t('canvas.sections.costs.metrics.kpi'),
        growth: t('canvas.sections.costs.metrics.growth'),
        efficiency: t('canvas.sections.costs.metrics.efficiency'),
        target: t('canvas.sections.costs.metrics.target'),
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
      color: sectionTitleColorClass,
      bgColor: 'bg-gradient-to-br from-space-dark to-space-darker',
      borderColor: 'border-neon-green/40'
    },
    {
      id: 'revenue',
      title: t('canvas.sections.revenue.title'),
      subtitle: t('canvas.sections.revenue.subtitle'),
      content: t('canvas.sections.revenue.content', {
        returnObjects: true,
      }) as string[],
      metrics: {
        kpi: t('canvas.sections.revenue.metrics.kpi'),
        growth: t('canvas.sections.revenue.metrics.growth'),
        efficiency: t('canvas.sections.revenue.metrics.efficiency'),
        target: t('canvas.sections.revenue.metrics.target'),
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
      color: sectionTitleColorClass,
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
    <View className={`flex-1 ${containerBgClass}`}>
      {/* Static header (non-scrollable) */}
      <View className="px-4">
        {/* Navigation Bar */}
        <View className="flex-row justify-between items-center mt-4 mb-4">
          {/* Left side - Back to Home (arrow) */}
          <TouchableOpacity 
            className="bg-neon-green/20 p-3 rounded-2xl border border-neon-green/50"
            onPress={() => router.push("/")}
          >
            <ArrowLeft size={20} color="#00FF9C" />
          </TouchableOpacity>
          
          {/* Center - Canvas Title */}
          <Text className={`${headerTextAccentClass} text-lg font-bold`}>
            {t('canvas.title')}
          </Text>
          
          {/* Right side - PDF Download */}
          <PDFExport position="navigation" />
        </View>
      </View>

      {/* Scrollable Business Model Canvas sections (cards only) */}
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-4">
        {/* Main Canvas Grid: left column spans two rows */}
        <View className="flex-row mb-6">
          {/* Left column: Socios Clave spanning two rows */}
          <View style={{ flex: 1 }}>
            <ExpandableCanvasSection
              section={canvasSections[0]}
              index={0}
              onPress={handleSectionPress}
            />
          </View>

          {/* Center and right columns: two stacked rows */}
          <View style={{ flex: 4, marginLeft: 8 }}>
            {/* Top row: Actividades / Propuesta / Relación */}
            <View className="flex-row mb-4">
              <View style={{ flex: 1.5 }}>
                <ExpandableCanvasSection
                  section={canvasSections[1]}
                  index={1}
                  onPress={handleSectionPress}
                />
              </View>
              <View style={{ flex: 1.5 }}>
                <ExpandableCanvasSection
                  section={canvasSections[2]}
                  index={2}
                  onPress={handleSectionPress}
                />
              </View>
              <View style={{ flex: 1 }}>
                <ExpandableCanvasSection
                  section={canvasSections[3]}
                  index={3}
                  onPress={handleSectionPress}
                />
              </View>
            </View>

            {/* Middle row: Recursos / Canales / Segmentos */}
            <View className="flex-row">
              <View style={{ flex: 1.5 }}>
                <ExpandableCanvasSection
                  section={canvasSections[5]}
                  index={5}
                  onPress={handleSectionPress}
                />
              </View>
              <View style={{ flex: 1.5 }}>
                <ExpandableCanvasSection
                  section={canvasSections[6]}
                  index={6}
                  onPress={handleSectionPress}
                />
              </View>
              <View style={{ flex: 1 }}>
                <ExpandableCanvasSection
                  section={canvasSections[4]}
                  index={4}
                  onPress={handleSectionPress}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Row: Costos / Ingresos spanning width */}
        <View className="flex-row mb-6">
          <View style={{ flex: 1 }}>
            <ExpandableCanvasSection
              section={canvasSections[7]}
              index={7}
              onPress={handleSectionPress}
            />
          </View>
          <View style={{ flex: 1 }}>
            <ExpandableCanvasSection
              section={canvasSections[8]}
              index={8}
              onPress={handleSectionPress}
            />
          </View>
        </View>
      </ScrollView>

      {/* Visión Estratégica Summary Footer (fixed, below scroll) */}
      <View className="px-4 pb-4">
        <View className="bg-gradient-to-br from-space-dark to-space-darker border-2 border-neon-green/40 rounded-3xl p-4">
          <View className="flex-row items-center mb-3">
            <View className="bg-neon-green/10 p-2 rounded-2xl border border-neon-green/30">
              <TrendingUp size={24} color="#00FF9C" />
            </View>
            <Text className={`${summaryTitleColorClass} text-lg font-bold ml-3`}>
              {t('canvas.summary.title')}
            </Text>
          </View>
          <View className="bg-neon-green/10 p-4 rounded-xl border border-neon-green/30 w-full max-w-md">
            <View className="space-y-3">
              <View className="flex-row items-center">
                <Target size={16} color="#00FF9C" className="mr-3" />
                <Text className={`${isDark ? 'text-human-primary' : 'text-human-text-light'} text-sm flex-1 font-inter`}>
                  {t('canvas.summary.items.impact')}
                </Text>
              </View>
              <View className="flex-row items-center">
                <TrendingUp size={16} color="#00FF9C" className="mr-3" />
                <Text className={`${isDark ? 'text-human-primary' : 'text-human-text-light'} text-sm flex-1 font-inter`}>
                  {t('canvas.summary.items.growth')}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Award size={16} color="#00FF9C" className="mr-3" />
                <Text className={`${isDark ? 'text-human-primary' : 'text-human-text-light'} text-sm flex-1 font-inter`}>
                  {t('canvas.summary.items.leadership')}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Section Modal */}
      <SectionModal
        visible={modalVisible}
        section={selectedSection}
        onClose={handleCloseModal}
      />

      {/* Manifesto Modal - shows on first load */}
      {manifestoChecked && showManifesto && (
        <ManifestoModal onClose={closeManifesto} />
      )}
    </View>
  );
}
