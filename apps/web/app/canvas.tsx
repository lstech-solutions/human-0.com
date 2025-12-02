import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { ExpandableCanvasSection, SectionModal, CanvasSection } from '../components/ExpandableCanvasSection';
import { ManifestoModal, useManifestoModal } from '../components/ManifestoModal';
import { CanvaModal } from '../components/CanvaModal';
import AnimatedSummaryRow, { SummaryAction } from '../components/AnimatedSummaryRow';
import { useRouter } from 'expo-router';
import { Building2, Activity, Target, Users, Lightbulb, MessageSquare, DollarSign, TrendingUp, Award, ImageIcon, User, ChevronLeft, ChevronRight, FileText, Download, Eye } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useTranslation } from '@human-0/i18n';
import { AppFooter } from '../components/AppFooter';
import { AnimatedBackground } from '../components/AnimatedBackground';

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
  const { showModal, closeModal: closeManifesto, openModal: showManifesto, checked: manifestoChecked } = useManifestoModal();
  const [canvasModalVisible, setCanvasModalVisible] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  // Define animated summary actions for the single row
  const animatedActions: SummaryAction[] = [
    {
      id: 'strategic-vision',
      title: 'Strategic Vision',
      icon: <TrendingUp size={24} color="#00FF9C" />,
      action: {
        type: 'view',
        target: 'vision',
        label: 'View Vision',
      },
    },
    {
      id: 'view-canvas',
      title: 'View Canvas',
      icon: <Target size={24} color="#00FF9C" />,
      action: {
        type: 'canvas',
        label: 'View Canvas',
      },
    },
    {
      id: 'manifesto',
      title: 'Manifesto',
      icon: <FileText size={24} color="#00FF9C" />,
      action: {
        type: 'manifesto',
        label: 'View Manifesto',
      },
    },
    {
      id: 'download-resources',
      title: 'PDF Resources',
      icon: <Download size={24} color="#00FF9C" />,
      action: {
        type: 'navigate',
        target: '/resources',
        label: 'Download Resources',
      },
    },
  ];
  const summaryData: SummaryItem[] = [
    {
      id: 'strategic-vision',
      title: t('canvas.summary.title'),
      icon: <TrendingUp size={24} color="#00FF9C" />,
      items: [
        {
          id: 'impact',
          title: t('canvas.summary.items.impact'),
          description: 'Sustainable impact through verified proofs',
        },
        {
          id: 'growth',
          title: t('canvas.summary.items.growth'),
          description: 'Scalable growth with community-driven approach',
        },
        {
          id: 'leadership',
          title: t('canvas.summary.items.leadership'),
          description: 'Leading the Web3 sustainability revolution',
        },
      ],
    },
    {
      id: 'canvas-actions',
      title: 'Business Model Canvas',
      icon: <Target size={24} color="#00FF9C" />,
      items: [
        {
          id: 'view-canvas',
          title: 'View Full Canvas',
          description: 'Explore detailed business model sections',
          action: {
            type: 'navigate',
            target: 'canvas',
            label: 'View Canvas',
          },
        },
        {
          id: 'export-canvas',
          title: 'Export Canvas Data',
          description: 'Download canvas as JSON or PDF',
          action: {
            type: 'download',
            target: 'canvas-export',
            label: 'Download',
          },
        },
      ],
    },
  ];
  
  const activitiesScrollRef = useRef<ScrollView>(null);
  const resourcesScrollRef = useRef<ScrollView>(null);
  
  const [activitiesCanScrollLeft, setActivitiesCanScrollLeft] = useState(false);
  const [activitiesCanScrollRight, setActivitiesCanScrollRight] = useState(true);
  const [resourcesCanScrollLeft, setResourcesCanScrollLeft] = useState(false);
  const [resourcesCanScrollRight, setResourcesCanScrollRight] = useState(true);
  
  const isLargeScreen = width >= 1024;

  const scrollToDirection = (scrollRef: React.RefObject<ScrollView | null>, direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 240; // Scroll by one card width + margin
    // @ts-ignore - web specific
    const currentScroll = (scrollRef.current as any).scrollLeft || 0;
    const newScroll = direction === 'right' 
      ? currentScroll + scrollAmount 
      : Math.max(0, currentScroll - scrollAmount);
    
    // @ts-ignore - web specific
    (scrollRef.current as any).scrollTo({
      x: newScroll,
      animated: true
    });
  };

  const handleScroll = (
    event: any,
    setCanScrollLeft: (value: boolean) => void,
    setCanScrollRight: (value: boolean) => void
  ) => {
    const scrollLeft = event.nativeEvent.contentOffset.x;
    const scrollWidth = event.nativeEvent.contentSize.width;
    const layoutWidth = event.nativeEvent.layoutMeasurement.width;
    
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - layoutWidth - 10);
  };

  // Add mouse wheel support for web
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleWheel = (scrollRef: React.RefObject<ScrollView | null>) => (e: Event) => {
      const wheelEvent = e as WheelEvent;
      if (scrollRef.current && Math.abs(wheelEvent.deltaX) > Math.abs(wheelEvent.deltaY)) {
        e.preventDefault();
        // @ts-ignore - web specific
        (scrollRef.current as any).scrollTo({
          x: (scrollRef.current as any).scrollLeft + wheelEvent.deltaX,
          animated: false
        });
      }
    };

    const activitiesEl = activitiesScrollRef.current as any;
    const resourcesEl = resourcesScrollRef.current as any;

    if (activitiesEl?._nativeTag) {
      const activitiesNode = document.querySelector(`[data-scroll="activities"]`);
      const activitiesHandler = handleWheel(activitiesScrollRef);
      activitiesNode?.addEventListener('wheel', activitiesHandler as EventListener, { passive: false });
    }

    if (resourcesEl?._nativeTag) {
      const resourcesNode = document.querySelector(`[data-scroll="resources"]`);
      const resourcesHandler = handleWheel(resourcesScrollRef);
      resourcesNode?.addEventListener('wheel', resourcesHandler as EventListener, { passive: false });
    }

    return () => {
      const activitiesNode = document.querySelector(`[data-scroll="activities"]`);
      const resourcesNode = document.querySelector(`[data-scroll="resources"]`);
      activitiesNode?.removeEventListener('wheel', handleWheel(activitiesScrollRef) as any);
      resourcesNode?.removeEventListener('wheel', handleWheel(resourcesScrollRef) as any);
    };
  }, []);

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

  const handleSummaryAction = (action: any) => {
  if (!action) return;
  
  switch (action.type) {
    case 'navigate':
      if (action.target?.startsWith('http')) {
        // External URL - open in browser
        window.open(action.target, '_blank');
      } else {
        // Internal navigation
        router.push(action.target || '/');
      }
      break;
    case 'download':
      if (action.target?.endsWith('.pdf')) {
        // Create download link for PDF
        const link = document.createElement('a');
        link.href = action.target;
        link.download = action.target.split('/').pop() || 'document.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Handle other downloads
        console.log('Download:', action.target);
      }
      break;
    case 'view':
      // Handle view action
      console.log('View:', action.target);
      break;
    case 'manifesto':
      // Open manifesto modal
      showManifesto();
      break;
    case 'canvas':
      // Open canvas modal
      setCanvasModalVisible(true);
      break;
  }
};

  return (
    <AnimatedBackground 
      isDark={isDark} 
      type="retro-grid"
      gridColor={isDark ? "#00FF9C" : "#059669"}
      showScanlines={true}
      glowEffect={true}
    >
      <View className={`flex-1 ${containerBgClass}`}>
        {/* Scrollable Business Model Canvas sections (cards only) */}
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-4">
        {/* Header */}
        <View className="mb-8 mt-12">
          <Text className={`text-4xl font-bold mb-2 tracking-widest leading-tight font-digitaldivine ${isDark ? "text-human-primary" : "text-[#0A1628]"}`}>
            <Text className={`${isDark ? "bg-gradient-to-r from-emerald-300 via-emerald-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,255,156,0.25)]" : "bg-gradient-to-r from-emerald-900 via-emerald-600 to-cyan-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,255,156,0.25)]"}`}>
              {t('hero.titleLine1')}
            </Text>
            <Text className={`block mt-1 lg:mt-2 ${isDark ? "bg-gradient-to-r from-cyan-300 via-emerald-400 to-emerald-200 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,255,156,0.25)]" : "bg-gradient-to-r from-cyan-900 via-emerald-600 to-emerald-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,255,156,0.25)]"}`}>
              {t('hero.titleLine2')}
            </Text>
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 text-base">
            {t('canvas.subtitle')}
          </Text>
        </View>
        {/* Main Canvas Grid: Standard Business Model Canvas Layout */}
        <View className="flex-row mb-4">
          {/* Left column: Key Partners spanning two rows */}
          <View style={{ width: isLargeScreen ? 220 : 140, marginRight: 16 }}>
            <View style={{ minHeight: isLargeScreen ? 500 : 420 }}>
              <ExpandableCanvasSection
                section={canvasSections[0]}
                index={0}
                onPress={handleSectionPress}
              />
            </View>
          </View>

          {/* Right side: Two rows */}
          <View style={{ flex: 1 }}>
            {/* Key Activities Row */}
            {isLargeScreen ? (
              // Large screen: Flex layout without scroll
              <View className="flex-row" style={{ minHeight: 240, marginBottom: 20 }}>
                <View style={{ flex: 1.5, marginRight: 8 }}>
                  <ExpandableCanvasSection
                    section={canvasSections[1]}
                    index={1}
                    onPress={handleSectionPress}
                  />
                </View>
                <View style={{ flex: 1.5, marginHorizontal: 8 }}>
                  <ExpandableCanvasSection
                    section={canvasSections[2]}
                    index={2}
                    onPress={handleSectionPress}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <ExpandableCanvasSection
                    section={canvasSections[3]}
                    index={3}
                    onPress={handleSectionPress}
                  />
                </View>
              </View>
            ) : (
              // Small screen: Horizontal scroll
              <View className="relative" data-scroll="activities" style={{ height: 200, marginBottom: 20 }}>
                <ScrollView 
                  ref={activitiesScrollRef}
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  decelerationRate="fast"
                  contentContainerStyle={{ paddingRight: 16 }}
                  onScroll={(e) => handleScroll(e, setActivitiesCanScrollLeft, setActivitiesCanScrollRight)}
                  scrollEventThrottle={16}
                >
                  <View style={{ width: 220, marginRight: 4 }}>
                    <ExpandableCanvasSection
                      section={canvasSections[1]}
                      index={1}
                      onPress={handleSectionPress}
                    />
                  </View>
                  <View style={{ width: 220, marginRight: 4 }}>
                    <ExpandableCanvasSection
                      section={canvasSections[2]}
                      index={2}
                      onPress={handleSectionPress}
                    />
                  </View>
                  <View style={{ width: 180 }}>
                    <ExpandableCanvasSection
                      section={canvasSections[3]}
                      index={3}
                      onPress={handleSectionPress}
                    />
                  </View>
                </ScrollView>
                
                {/* Scroll Buttons */}
                {activitiesCanScrollLeft && (
                  <TouchableOpacity
                    onPress={() => scrollToDirection(activitiesScrollRef, 'left')}
                    className="absolute left-0 top-1/2 bg-neon-green/20 p-2 rounded-full border border-neon-green/50 z-10"
                    style={{ transform: [{ translateY: -16 }] }}
                  >
                    <ChevronLeft size={20} color="#00FF9C" />
                  </TouchableOpacity>
                )}
                
                {activitiesCanScrollRight && (
                  <TouchableOpacity
                    onPress={() => scrollToDirection(activitiesScrollRef, 'right')}
                    className="absolute right-0 top-1/2 bg-neon-green/20 p-2 rounded-full border border-neon-green/50 z-10"
                    style={{ transform: [{ translateY: -16 }] }}
                  >
                    <ChevronRight size={20} color="#00FF9C" />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Key Resources Row */}
            {isLargeScreen ? (
              // Large screen: Flex layout without scroll
              <View className="flex-row" style={{ minHeight: 240 }}>
                <View style={{ flex: 1.5, marginRight: 8 }}>
                  <ExpandableCanvasSection
                    section={canvasSections[5]}
                    index={5}
                    onPress={handleSectionPress}
                  />
                </View>
                <View style={{ flex: 1.5, marginHorizontal: 8 }}>
                  <ExpandableCanvasSection
                    section={canvasSections[6]}
                    index={6}
                    onPress={handleSectionPress}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <ExpandableCanvasSection
                    section={canvasSections[4]}
                    index={4}
                    onPress={handleSectionPress}
                  />
                </View>
              </View>
            ) : (
              // Small screen: Horizontal scroll
              <View className="relative" data-scroll="resources" style={{ height: 200 }}>
                <ScrollView 
                  ref={resourcesScrollRef}
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  decelerationRate="fast"
                  contentContainerStyle={{ paddingRight: 16 }}
                  onScroll={(e) => handleScroll(e, setResourcesCanScrollLeft, setResourcesCanScrollRight)}
                  scrollEventThrottle={16}
                >
                  <View style={{ width: 220, marginRight: 4 }}>
                    <ExpandableCanvasSection
                      section={canvasSections[5]}
                      index={5}
                      onPress={handleSectionPress}
                    />
                  </View>
                  <View style={{ width: 220, marginRight: 4 }}>
                    <ExpandableCanvasSection
                      section={canvasSections[6]}
                      index={6}
                      onPress={handleSectionPress}
                    />
                  </View>
                  <View style={{ width: 180 }}>
                    <ExpandableCanvasSection
                      section={canvasSections[4]}
                      index={4}
                      onPress={handleSectionPress}
                    />
                  </View>
                </ScrollView>
                
                {/* Scroll Buttons */}
                {resourcesCanScrollLeft && (
                  <TouchableOpacity
                    onPress={() => scrollToDirection(resourcesScrollRef, 'left')}
                    className="absolute left-0 top-1/2 bg-neon-green/20 p-2 rounded-full border border-neon-green/50 z-10"
                    style={{ transform: [{ translateY: -16 }] }}
                  >
                    <ChevronLeft size={20} color="#00FF9C" />
                  </TouchableOpacity>
                )}
                
                {resourcesCanScrollRight && (
                  <TouchableOpacity
                    onPress={() => scrollToDirection(resourcesScrollRef, 'right')}
                    className="absolute right-0 top-1/2 bg-neon-green/20 p-2 rounded-full border border-neon-green/50 z-10"
                    style={{ transform: [{ translateY: -16 }] }}
                  >
                    <ChevronRight size={20} color="#00FF9C" />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Cost Structure & Revenue Streams - Full Width Side by Side */}
        <View className="flex-row mb-6 mt-6" style={{ minHeight: isLargeScreen ? 280 : 220 }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <ExpandableCanvasSection
              section={canvasSections[7]}
              index={7}
              onPress={handleSectionPress}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <ExpandableCanvasSection
              section={canvasSections[8]}
              index={8}
              onPress={handleSectionPress}
            />
          </View>
        </View>
      </ScrollView>

      {/* Animated Summary Row - Single row with expanding buttons */}
      <AnimatedSummaryRow actions={animatedActions} onAction={handleSummaryAction} />

      {/* Section Modal */}
      <SectionModal
        visible={modalVisible}
        section={selectedSection}
        onClose={handleCloseModal}
      />

      {/* Manifesto Modal - shows on first load */}
      {manifestoChecked && showModal && (
        <ManifestoModal onClose={closeManifesto} />
      )}

      {/* Canva Modal */}
      <CanvaModal
        visible={canvasModalVisible}
        onClose={() => setCanvasModalVisible(false)}
      />

      {/* App Footer - same as identity view */}
      <AppFooter />
    </View>
    </AnimatedBackground>
  );
}
