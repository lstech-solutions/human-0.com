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
      
      // For web, open the PDF
      if (typeof window !== 'undefined') {
        const link = document.createElement('a');
        link.href = downloadFile;
        link.download = pdf.title.replace(/\s+/g, '-') + '.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        Alert.alert(
          'PDF Descargado',
          `${pdf.title} ha sido descargado exitosamente.`,
          [{ text: 'OK' }]
        );
      } else {
        // For mobile, try to open the PDF
        window.open(downloadFile, '_blank');
      }

    } catch (error) {
      console.error('PDF download error:', error);
      Alert.alert(
        'Error al Descargar', 
        `No se pudo descargar ${pdf.title}. Por favor intente nuevamente.`,
        [{ text: 'OK' }]
      );
    } finally {
      setSelectedPDF(null);
    }
  };

  const renderLanguageSelector = () => (
    <View className="bg-gradient-to-br from-space-dark to-space-darker border-2 border-neon-green/40 rounded-3xl p-4 mb-6">
      <View className="flex-row items-center mb-3">
        <Globe size={20} color="#00FF9C" />
        <Text className="text-neon-green text-lg font-bold ml-3">
          Select Language / Seleccionar Idioma
        </Text>
      </View>
      
      <View className="flex-row space-x-3">
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            onPress={() => setSelectedLanguage(lang.code)}
            className={`flex-1 p-3 rounded-xl border-2 flex-row items-center justify-center ${
              selectedLanguage === lang.code
                ? 'bg-neon-green/20 border-neon-green'
                : 'bg-space-dark/50 border-gray-600'
            }`}
          >
            <Text className="text-xl mr-2">{lang.flag}</Text>
            <Text className={`text-sm font-semibold ${
              selectedLanguage === lang.code ? 'text-neon-green' : 'text-gray-400'
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
      className={`bg-gradient-to-br from-space-dark to-space-darker border-2 rounded-3xl p-6 mb-4 transition-all ${
        pdf.type === 'standard' 
          ? 'border-neon-green/40' 
          : 'border-purple-500/40'
      } ${selectedPDF === pdf.id ? 'opacity-50' : ''}`}
    >
      <View className="flex-row items-start mb-4">
        <View className={`p-3 rounded-2xl border ${
          pdf.type === 'standard'
            ? 'bg-neon-green/10 border-neon-green/30'
            : 'bg-purple-500/10 border-purple-500/30'
        }`}>
          {pdf.icon}
        </View>
        <View className="ml-4 flex-1">
          <Text className={`text-xl font-bold mb-1 ${
            pdf.type === 'standard' ? 'text-neon-green' : 'text-purple-400'
          }`}>
            {pdf.title}
          </Text>
          <Text className="text-gray-400 text-sm leading-relaxed">
            {pdf.description}
          </Text>
          <Text className="text-gray-500 text-xs mt-2">
            File size: {pdf.size}
          </Text>
          {pdf.languages && (
            <View className="flex-row items-center mt-2">
              <Globe size={12} color="#00FF9C" />
              <Text className="text-gray-400 text-xs ml-1">
                Available in: {pdf.languages.map(l => 
                  languages.find(lang => lang.code === l)?.name
                ).join(' • ')}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View className="space-y-2 mb-4">
        {pdf.features.map((feature, index) => (
          <View key={index} className="flex-row items-center">
            <CheckCircle size={14} color="#00FF9C" className="mr-2" />
            <Text className="text-gray-300 text-sm flex-1">
              {feature}
            </Text>
          </View>
        ))}
      </View>

      <View className={`flex-row items-center justify-center p-3 rounded-xl border ${
        pdf.type === 'standard'
          ? 'bg-neon-green/20 border-neon-green/50'
          : 'bg-purple-500/20 border-purple-500/50'
      }`}>
        <Download size={20} color={pdf.type === 'standard' ? "#00FF9C" : "#A855F7"} />
        <Text className={`ml-2 font-semibold ${
          pdf.type === 'standard' ? 'text-neon-green' : 'text-purple-400'
        }`}>
          {selectedPDF === pdf.id ? 'Downloading...' : 'Download PDF'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gradient-to-b from-deep-space to-space-dark">
      {/* Header */}
      <View className="px-6 pt-12 pb-6">
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity 
            onPress={() => router.push('/')} 
            className="bg-space-dark/50 backdrop-blur-lg p-3 rounded-2xl border border-neon-green/30"
          >
            <ArrowLeft size={24} color="#00FF9C" />
          </TouchableOpacity>
          
          <View className="flex-1" /> {/* Spacer to balance layout */}
        </View>
        
        <View className="items-center">
          <Text className="text-neon-green text-3xl font-bold">
            PDF Downloads
          </Text>
          <Text className="text-gray-400 text-sm mt-1">
            Choose your language and Business Model Canvas format
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-6">
        {/* Language Selector */}
        {renderLanguageSelector()}
        
        {/* Info Card */}
        <View className="bg-gradient-to-br from-space-dark to-space-darker border-2 border-neon-green/40 rounded-3xl p-6 mb-6">
          <Text className="text-neon-green text-lg font-bold mb-3">
            📊 Business Model Documentation
          </Text>
          <Text className="text-gray-300 text-sm leading-relaxed mb-4">
            Download comprehensive documentation of HUMΛN-Ø's Business Model Canvas in 
            your preferred language. Choose between the quick visual reference or the 
            detailed extended version with full analysis and strategic insights.
          </Text>
          <View className="flex-row space-x-4">
            <View className="flex-1 bg-neon-green/10 p-3 rounded-xl border border-neon-green/30">
              <Text className="text-neon-green text-xs font-semibold text-center">
                Multi-Language Support
              </Text>
            </View>
            <View className="flex-1 bg-purple-500/10 p-3 rounded-xl border border-purple-500/30">
              <Text className="text-purple-400 text-xs font-semibold text-center">
                Print Ready
              </Text>
            </View>
          </View>
        </View>

        {/* PDF Options */}
        {pdfOptions.map(renderPDFCard)}

        {/* Footer Info */}
        <View className="bg-space-dark/50 rounded-2xl p-4 mb-8">
          <Text className="text-gray-400 text-xs text-center">
            💡 Tip: Download both versions for complete documentation
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
