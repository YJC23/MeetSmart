import { Tabs } from "expo-router/tabs";
import { FontAwesome } from "@expo/vector-icons"; // Assuming you are using FontAwesome icons

export default function AppLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "My Profile",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" color={color} size={size} />
          ),
          headerTitleAlign: "left",
          headerTitleStyle: {
            fontSize: 25,
          },
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: "Meet Friends",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="heart" color={color} size={size} />
          ),
          headerTitleAlign: "left",
          headerTitleStyle: {
            fontSize: 25,
          },
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          href: null,
          title: "Schedule Meeting",
          headerTitleAlign: "left",
          headerTitleStyle: {
            fontSize: 25,
          },
        }}
      />
    </Tabs>
  );
}
