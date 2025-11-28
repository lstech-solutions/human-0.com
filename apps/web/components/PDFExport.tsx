import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Download } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme/ThemeProvider';

interface PDFExportProps {
  className?: string;
  position?: 'navigation' | 'floating';
}

const PDFExport: React.FC<PDFExportProps> = ({ className = '', position = 'floating' }) => {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const navButtonClass = isDark
    ? 'bg-neon-green/15 border border-neon-green/70'
    : 'bg-white border border-neon-green/60';

  const navTextClass = isDark
    ? 'text-human-primary'
    : 'text-emerald-700';

  const floatingButtonClass = isDark
    ? 'bg-neon-green/20 border border-neon-green/70 shadow-neon-green/40'
    : 'bg-emerald-500 border border-emerald-500 shadow-emerald-300/60';

  const navigateToPDFDownload = () => {
    router.push('/pdf-download');
  };

  if (position === 'navigation') {
    return (
      <TouchableOpacity
        onPress={navigateToPDFDownload}
        className={`${navButtonClass} p-2 rounded-xl flex-row items-center ${className}`}
      >
        <Download size={16} color={isDark ? '#00FF9C' : '#047857'} />
        <Text className={`${navTextClass} text-xs font-semibold ml-1`}>PDF</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View className={`justify-center ${className}`}>
      <TouchableOpacity
        onPress={navigateToPDFDownload}
        className={`${floatingButtonClass} p-3 rounded-full flex-row items-center shadow-lg`}
      >
        <Download size={12} color={isDark ? '#00FF9C' : '#ECFDF5'} />
      </TouchableOpacity>
    </View>
  );
};

export default PDFExport;
