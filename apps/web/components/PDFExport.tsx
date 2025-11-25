import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Download } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface PDFExportProps {
  className?: string;
  position?: 'navigation' | 'floating';
}

const PDFExport: React.FC<PDFExportProps> = ({ className = '', position = 'floating' }) => {
  const router = useRouter();

  const navigateToPDFDownload = () => {
    router.push('/pdf-download');
  };

  if (position === 'navigation') {
    return (
      <TouchableOpacity
        onPress={navigateToPDFDownload}
        className={`bg-neon-green/20 border border-neon-green/50 p-2 rounded-xl flex-row items-center ${className}`}
      >
        <Download size={16} color="#00FF9C" />
        <Text className="text-neon-green text-xs font-semibold ml-1">PDF</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View className={`justify-center ${className}`}>
      <TouchableOpacity
        onPress={navigateToPDFDownload}
        className="bg-neon-green/20 border border-neon-green/50 p-3 rounded-full flex-row items-center shadow-lg shadow-neon-green/20"
      >
        <Download size={12} color="#00FF9C" />
      </TouchableOpacity>
    </View>
  );
};

export default PDFExport;
