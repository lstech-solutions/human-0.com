import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { ArrowLeft, Download, FileText, BookOpen, CheckCircle, Globe } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { apiClient } from '../lib/api-client';
import { useTheme } from '../theme/ThemeProvider';

const { width, height } = Dimensions.get('window');

interface PDFOption {
  id: string;
  title: string;
  description: string;
  filename: string;
  icon: React.ReactNode;
  features: string[];
  size: string;
  type: 'standard' | 'extended';
  languages?: string[];
}

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
  filename: string;
}

export default function PDFDownloadScreen() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

  const pdfOptions: PDFOption[] = [
    {
      id: 'canvas-single',
      title: 'Canvas Infographic (Single Page)',
      description: 'One-page vertical infographic with colorful canvas model structure - perfect for presentations',
      filename: '/output/HUMAN-ZERO-Canvas-Infographic-EN.pdf',
      icon: <FileText size={32} color="#00FF9C" />,
      features: [
        'True single-page design (A4 portrait)',
        'Colorful infographic style',
        'Visual canvas model structure',
        'Each section color-coded',
        'Professional presentation format',
        'Print-ready quality'
      ],
      size: '269 KB',
      type: 'standard',
      languages: ['en', 'es']
    },
    {
      id: 'canvas-extended',
      title: 'Extended Business Model',
      description: 'Comprehensive detailed version with full analysis and documentation',
      filename: '/output/HUMAN-ZERO-Business-Model-Extended.pdf',
      icon: <BookOpen size={32} color="#00FF9C" />,
      features: [
        'Detailed section analysis',
        'Executive summary',
        'Technical specifications',
        'Financial projections',
        'Implementation roadmap',
        'Risk assessment',
        'Market analysis'
      ],
      size: '4.8 MB',
      type: 'extended'
    }
  ];

  const languages: LanguageOption[] = [
    { code: 'en', name: 'English', flag: '🇬🇧', filename: '/output/HUMAN-ZERO-Canvas-Infographic-EN.pdf' },
    { code: 'es', name: 'Español', flag: '🇪🇸', filename: '/output/HUMAN-ZERO-Canvas-Infographic-ES.pdf' }
  ];

  const downloadPDF = async (pdf: PDFOption) => {
    try {
      setSelectedPDF(pdf.id);
      
      // Use language-specific filename if available
      let downloadFile = pdf.filename;
      if (pdf.languages && pdf.languages.includes(selectedLanguage)) {
        const langOption = languages.find(l => l.code === selectedLanguage);
        if (langOption) {
          downloadFile = langOption.filename;
        }
      }
      
      // For web environment
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        // First, try to check if the file exists by making a HEAD request
        try {
          const response = await apiClient.head(downloadFile);
          if (!response.ok) {
            throw new Error(`PDF file not found (${response.status})`);
          }
        } catch (fetchError) {
          console.error('PDF file check failed:', fetchError);
          Alert.alert(
            'PDF No Disponible',
            `El archivo PDF no está disponible temporalmente. Por favor intente más tarde o contacte soporte.`,
            [{ text: 'OK' }]
          );
          return;
        }
        
        // Create a temporary link element for download
        const link = document.createElement('a');
        link.href = downloadFile;
        link.download = pdf.title.replace(/\s+/g, '-') + '.pdf';
        link.target = '_blank';
        link.style.display = 'none';
        
        // Add to DOM, trigger click, then remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message
        Alert.alert(
          'PDF Descargado',
          `${pdf.title} ha sido descargado exitosamente.`,
          [{ text: 'OK' }]
        );
      } else if (typeof window !== 'undefined') {
        // Fallback for environments where window exists but document might not
        window.open(downloadFile, '_blank');
      } else {
        // Final fallback - show error message
        Alert.alert(
          'Entorno No Compatible',
          'La descarga de PDF no es compatible con este entorno.',
          [{ text: 'OK' }]
        );
      }

    } catch (error) {
      console.error('PDF download error:', error);
      
      // Provide more helpful error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      Alert.alert(
        'Error al Descargar', 
        `No se pudo descargar ${pdf.title}. Error: ${errorMessage}\n\nPor favor intente nuevamente o contacte soporte.`,
        [{ text: 'OK' }]
      );
    } finally {
      setSelectedPDF(null);
    }
  };

  const renderLanguageSelector = () => (
    <View className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 mb-6 shadow-lg shadow-black/10">
      <View className="flex-row items-center mb-4">
        <View className="bg-neon-green/10 rounded-2xl p-3">
          <Globe size={20} color="#00FF9C" />
        </View>
        <Text className="text-human-primary text-lg font-bold ml-3">
          Choose Language
        </Text>
      </View>
      
      <View className="flex-row gap-3">
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            onPress={() => setSelectedLanguage(lang.code)}
            className={`flex-1 p-4 rounded-2xl border flex-row items-center justify-center transition-all ${
              selectedLanguage === lang.code
                ? 'bg-white/20 border-white/40 shadow-lg shadow-black/20'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <Text className="text-lg mr-2">{lang.flag}</Text>
            <Text className={`text-sm font-semibold ${
              selectedLanguage === lang.code ? 'text-human-primary' : 'text-gray-300'
            }`}>
              {lang.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderPDFCard = (pdf: PDFOption) => (
    <TouchableOpacity
      key={pdf.id}
      onPress={() => downloadPDF(pdf)}
      disabled={selectedPDF === pdf.id}
      className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 mb-4 transition-all shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20 ${
        selectedPDF === pdf.id ? 'opacity-60' : ''
      }`}
    >
      <View className="flex-row items-start mb-4">
        <View className={`p-4 rounded-2xl border shadow-md ${
          pdf.type === 'standard'
            ? 'bg-neon-green/10 border-neon-green/30 shadow-neon-green/20'
            : 'bg-purple-500/10 border-purple-500/30 shadow-purple-500/20'
        }`}>
          {pdf.icon}
        </View>
        <View className="ml-4 flex-1">
          <Text className={`text-xl font-bold mb-2 ${
            pdf.type === 'standard' ? 'text-human-primary' : 'text-purple-400'
          }`}>
            {pdf.title}
          </Text>
          <Text className={isDark ? 'text-gray-200 text-sm leading-relaxed mb-3' : 'text-gray-600 text-sm leading-relaxed mb-3'}>
            {pdf.description}
          </Text>
          
          {/* Metadata */}
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <FileText size={14} color={isDark ? '#9CA3AF' : '#6B7280'} className="mr-1" />
              <Text className={isDark ? 'text-gray-400 text-xs' : 'text-gray-500 text-xs'}>
                {pdf.size}
              </Text>
            </View>
            {pdf.languages && (
              <View className="flex-row items-center">
                <Globe size={14} color="#00FF9C" className="mr-1" />
                <Text className="text-gray-300 text-xs">
                  {pdf.languages.length} languages
                </Text>
              </View>
            )}
          </View>
          
          {/* Features */}
          <View className="flex-row flex-wrap gap-2">
            {pdf.features.slice(0, 2).map((feature, index) => (
              <View key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1">
                <Text className="text-gray-300 text-xs">
                  {feature}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Download Button */}
      <View className={`flex-row items-center justify-between p-4 rounded-2xl border ${
        pdf.type === 'standard' 
          ? 'bg-neon-green/10 border-neon-green/30' 
          : 'bg-purple-500/10 border-purple-500/30'
      }`}>
        <View className="flex-row items-center">
          <Download size={16} color={pdf.type === 'standard' ? '#00FF9C' : '#A855F7'} />
          <Text className={`ml-2 text-sm font-medium ${
            pdf.type === 'standard' ? 'text-human-primary' : 'text-white'
          }`}>
            {selectedPDF === pdf.id ? 'Preparing download...' : 'Download now'}
          </Text>
        </View>
        <View className="bg-white/10 rounded-full p-2">
          <ArrowLeft size={14} color={isDark ? '#FFFFFF' : '#1F2937'} style={{ transform: [{ rotate: '-90deg' }] }} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1">
      {/* Glassmorphism Header */}
      <View className="relative overflow-hidden">
        <View className="absolute inset-0 bg-gradient-to-br from-neon-green/5 to-emerald-600/5 backdrop-blur-xl" />
        <View className="relative px-6 pt-12 pb-8">
          <View className="items-center">
            <View className="mb-4">
              <View className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-4 shadow-lg shadow-black/20">
                <Download size={32} color="#00FF9C" />
              </View>
            </View>
            <Text className="text-human-primary text-4xl font-bold mb-2 text-center">
              Resource Library
            </Text>
            <Text className={isDark ? 'text-gray-200 text-base text-center leading-relaxed' : 'text-gray-600 text-base text-center leading-relaxed'}>
              Access comprehensive documentation and business model resources
            </Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-6">
        {/* Language Selector */}
        {renderLanguageSelector()}
        
        {/* Modern Info Card */}
        <View className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 mb-6 shadow-lg shadow-black/10">
          <View className="flex-row items-center mb-4">
            <View className="bg-neon-green/10 rounded-2xl p-3">
              <BookOpen size={24} color="#00FF9C" />
            </View>
            <Text className="text-human-primary text-2xl font-bold ml-3">
              Business Model Resources
            </Text>
          </View>
          <Text className={isDark ? 'text-gray-200 text-base leading-relaxed mb-6' : 'text-gray-600 text-base leading-relaxed mb-6'}>
            Explore our comprehensive collection of business model documentation, 
            from quick visual references to detailed strategic analyses with actionable insights.
          </Text>
          
          {/* Feature Pills */}
          <View className="flex-row flex-wrap gap-3">
            <View className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 flex-row items-center">
              <Globe size={14} color="#00FF9C" className="mr-2" />
              <Text className="text-gray-300 text-sm font-medium">
                Multi-Language Support
              </Text>
            </View>
            <View className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 flex-row items-center">
              <FileText size={14} color="#A855F7" className="mr-2" />
              <Text className="text-gray-300 text-sm font-medium">
                Print Ready
              </Text>
            </View>
            <View className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 flex-row items-center">
              <CheckCircle size={14} color="#10B981" className="mr-2" />
              <Text className="text-gray-300 text-sm font-medium">
                High Quality
              </Text>
            </View>
          </View>
        </View>

        {/* PDF Options */}
        {pdfOptions.map(renderPDFCard)}

        {/* Footer Info */}
        <View className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 mb-8 shadow-lg shadow-black/10">
          <View className="flex-row items-center justify-center">
            <View className="bg-neon-green/10 rounded-2xl p-3 mr-3">
              <BookOpen size={20} color="#00FF9C" />
            </View>
            <Text className="text-gray-200 text-sm text-center flex-1">
              💡 Download both versions for complete business model documentation
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
