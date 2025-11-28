import { Pressable, Text, View, Modal, FlatList } from "react-native";
import { useState } from "react";
import { useLanguagePicker } from "@human-0/i18n/hooks";

/**
 * Language switcher dropdown component
 */
export function LanguageSwitcher() {
  const { currentLanguage, languages, setLanguage } = useLanguagePicker();
  const [modalVisible, setModalVisible] = useState(false);

  const currentLang = languages.find((l) => l.code === currentLanguage);

  return (
    <View>
      <Pressable
        onPress={() => setModalVisible(true)}
        className="flex-row items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800"
      >
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {currentLang?.nativeName || "English"}
        </Text>
        <Text className="text-xs text-gray-500">▼</Text>
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center"
          onPress={() => setModalVisible(false)}
        >
          <View className="bg-white dark:bg-gray-900 rounded-xl w-72 max-h-96 overflow-hidden shadow-xl">
            <View className="p-4 border-b border-gray-200 dark:border-gray-700">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                Select Language
              </Text>
            </View>
            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setLanguage(item.code);
                    setModalVisible(false);
                  }}
                  className={`px-4 py-3 border-b border-gray-100 dark:border-gray-800 ${
                    item.code === currentLanguage
                      ? "bg-emerald-50 dark:bg-emerald-900/20"
                      : ""
                  }`}
                >
                  <Text
                    className={`text-base ${
                      item.code === currentLanguage
                        ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                    style={item.rtl ? { textAlign: "right" } : undefined}
                  >
                    {item.nativeName}
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-500">
                    {item.name}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
