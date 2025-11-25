import { View, Text, ScrollView, Image } from "react-native";
import { Award, Sparkles } from "lucide-react-native";
import GlowButton from "@/components/GlowButton";

interface NFT {
  id: string;
  name: string;
  image: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  impact: string;
}

export default function NFTsScreen() {
  const nfts: NFT[] = [
    {
      id: "1",
      name: "Carbon Warrior #001",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80",
      rarity: "Legendary",
      impact: "1000 kg CO₂",
    },
    {
      id: "2",
      name: "Solar Pioneer #042",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80",
      rarity: "Epic",
      impact: "500 kWh",
    },
    {
      id: "3",
      name: "Tree Guardian #128",
      image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&q=80",
      rarity: "Rare",
      impact: "50 Trees",
    },
    {
      id: "4",
      name: "Ocean Protector #256",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80",
      rarity: "Epic",
      impact: "200 kg Plastic",
    },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Legendary":
        return "#FFD700";
      case "Epic":
        return "#9C27B0";
      case "Rare":
        return "#2196F3";
      default:
        return "#9CA3AF";
    }
  };

  return (
    <ScrollView className="flex-1 bg-deep-space">
      <View className="px-6 py-12">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-neon-green text-4xl font-bold mb-2">
            NFT Collection
          </Text>
          <Text className="text-gray-400 text-base">
            Your environmental achievement badges
          </Text>
        </View>

        {/* Collection Stats */}
        <View className="bg-space-dark border-2 border-neon-green rounded-3xl p-6 mb-8">
          <View className="flex-row items-center mb-4">
            <Award size={28} color="#00FF9C" />
            <Text className="text-white text-xl font-bold ml-3">
              Collection Overview
            </Text>
          </View>
          
          <View className="flex-row justify-between">
            <View>
              <Text className="text-neon-green text-3xl font-bold">12</Text>
              <Text className="text-gray-400 text-sm mt-1">Total NFTs</Text>
            </View>
            
            <View>
              <Text className="text-neon-green text-3xl font-bold">3</Text>
              <Text className="text-gray-400 text-sm mt-1">Legendary</Text>
            </View>
            
            <View>
              <Text className="text-neon-green text-3xl font-bold">8.5</Text>
              <Text className="text-gray-400 text-sm mt-1">Total Value ETH</Text>
            </View>
          </View>
        </View>

        {/* Mint New NFT */}
        <View className="bg-gradient-to-r from-neon-green/10 to-transparent border border-neon-green/30 rounded-2xl p-6 mb-8">
          <View className="flex-row items-center mb-3">
            <Sparkles size={24} color="#00FF9C" />
            <Text className="text-white text-lg font-bold ml-2">
              Ready to Mint?
            </Text>
          </View>
          <Text className="text-gray-400 text-sm mb-4">
            You've earned enough impact points to mint a new NFT!
          </Text>
          <GlowButton variant="primary" size="md">
            Mint New NFT
          </GlowButton>
        </View>

        {/* NFT Grid */}
        <View className="mb-8">
          <Text className="text-white text-2xl font-bold mb-4">Your NFTs</Text>
          
          <View className="flex-row flex-wrap justify-between">
            {nfts.map((nft) => (
              <View
                key={nft.id}
                className="w-[48%] bg-space-dark border border-neon-green/20 rounded-2xl overflow-hidden mb-4"
              >
                <Image
                  source={{ uri: nft.image }}
                  style={{ width: "100%", height: 180 }}
                  resizeMode="cover"
                />
                
                <View className="p-4">
                  <View
                    className="px-3 py-1 rounded-full self-start mb-2"
                    style={{ backgroundColor: getRarityColor(nft.rarity) + "20" }}
                  >
                    <Text
                      className="text-xs font-bold"
                      style={{ color: getRarityColor(nft.rarity) }}
                    >
                      {nft.rarity}
                    </Text>
                  </View>
                  
                  <Text className="text-white text-base font-semibold mb-1">
                    {nft.name}
                  </Text>
                  
                  <Text className="text-gray-400 text-xs">
                    Impact: {nft.impact}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Marketplace Link */}
        <View className="items-center">
          <GlowButton variant="secondary" size="lg">
            View on Marketplace
          </GlowButton>
        </View>
      </View>
    </ScrollView>
  );
}
