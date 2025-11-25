import { View, Text, ScrollView } from "react-native";
import { Leaf, Zap, Globe, Award, TrendingUp, Image as ImageIcon, User } from "lucide-react-native";
import { useRouter } from "expo-router";
import Logo from "@/components/Logo";
import GlowButton from "@/components/GlowButton";
import FeatureCard from "@/components/FeatureCard";
import QuickAccessCard from "@/components/QuickAccessCard";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-deep-space">
      <View className="flex-1 px-6 py-12">
        {/* Hero Section */}
        <View className="items-center mb-16 mt-8">
          <Logo size={160} />
          <Text className="text-neon-green text-5xl font-bold mt-8 text-center">
            HUMΛN-Ø
          </Text>
          <Text className="text-gray-400 text-lg mt-4 text-center max-w-md">
            Achieve Net Zero Climate Impact Through Web3 Innovation
          </Text>
          
          <View className="flex-row gap-4 mt-8">
            <GlowButton 
              variant="primary" 
              size="lg"
              onPress={() => router.push("/profile")}
            >
              Get Started
            </GlowButton>
            <GlowButton 
              variant="secondary" 
              size="lg"
              onPress={() => router.push("/impact")}
            >
              Learn More
            </GlowButton>
          </View>
        </View>

        {/* Quick Access Section */}
        <View className="mb-12">
          <Text className="text-neon-green text-3xl font-bold mb-6 text-center">
            Quick Access
          </Text>
          
          <QuickAccessCard
            icon={<TrendingUp size={24} color="#00FF9C" />}
            title="Track Impact"
            description="View and log your climate actions"
            onPress={() => router.push("/impact")}
          />
          
          <QuickAccessCard
            icon={<ImageIcon size={24} color="#00FF9C" />}
            title="NFT Collection"
            description="Browse and mint achievement NFTs"
            onPress={() => router.push("/nfts")}
          />
          
          <QuickAccessCard
            icon={<User size={24} color="#00FF9C" />}
            title="Profile"
            description="Manage your account and wallet"
            onPress={() => router.push("/profile")}
          />
        </View>

        {/* Features Section */}
        <View className="mb-12">\n          <Text className="text-neon-green text-3xl font-bold mb-6 text-center">\n            Platform Features\n          </Text>
          
          <FeatureCard
            icon={<Leaf size={32} color="#00FF9C" />}
            title="Impact Tracking"
            description="Monitor and record your climate impact in real-time with blockchain-verified data. Every action counts towards a sustainable future."
          />
          
          <FeatureCard
            icon={<Award size={32} color="#00FF9C" />}
            title="NFT Rewards"
            description="Earn unique NFTs as proof of your environmental contributions. Mint, collect, and showcase your commitment to Net Zero."
          />
          
          <FeatureCard
            icon={<Zap size={32} color="#00FF9C" />}
            title="Smart Contracts"
            description="Transparent, automated impact verification powered by Ethereum smart contracts. Trust through technology."
          />
          
          <FeatureCard
            icon={<Globe size={32} color="#00FF9C" />}
            title="Global Community"
            description="Join a worldwide movement of individuals and organizations committed to achieving Net Zero emissions."
          />
        </View>

        {/* Stats Section */}
        <View className="bg-space-dark border border-neon-green/30 rounded-3xl p-8 mb-12">
          <Text className="text-neon-green text-2xl font-bold mb-6 text-center">
            Platform Impact
          </Text>
          
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-neon-green text-4xl font-bold">1.2M</Text>
              <Text className="text-gray-400 text-sm mt-2">Tons CO₂ Offset</Text>
            </View>
            
            <View className="items-center">
              <Text className="text-neon-green text-4xl font-bold">50K+</Text>
              <Text className="text-gray-400 text-sm mt-2">Active Users</Text>
            </View>
            
            <View className="items-center">
              <Text className="text-neon-green text-4xl font-bold">100K+</Text>
              <Text className="text-gray-400 text-sm mt-2">NFTs Minted</Text>
            </View>
          </View>
        </View>

        {/* CTA Section */}
        <View className="items-center mb-12">
          <Text className="text-white text-2xl font-bold mb-4 text-center">
            Ready to Make an Impact?
          </Text>
          <Text className="text-gray-400 text-base mb-6 text-center max-w-md">
            Connect your wallet and start your journey towards Net Zero today.
          </Text>
          <GlowButton 
            variant="primary" 
            size="lg"
            onPress={() => router.push("/profile")}
          >
            Connect Wallet
          </GlowButton>
        </View>

        {/* Footer */}
        <View className="border-t border-neon-green/20 pt-8 items-center">
          <Text className="text-gray-500 text-sm text-center">
            © 2025 HUMΛN-Ø. Building a sustainable future with Web3.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
