import React from "react"; // added line to fix issues w ts
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { StyleSheet, View, Pressable, Alert, Text } from "react-native";
import { Button, Input } from "react-native-elements";
import { Session } from "@supabase/supabase-js";
import { FlashList } from "@shopify/flash-list";
import { router, Link, useLocalSearchParams, Stack } from "expo-router";

export default function Users({ session }: { session: Session }) {
  //   const [loading, setLoading] = useState(true);
  //   const [username, setUsername] = useState("");
  //   const [website, setWebsite] = useState("");
  //   const [name, setName] = useState("");
  const [users, setUsers] = useState<
    { id: string; username: string; full_name: string }[]
  >([]);

  useEffect(() => {
    // re-render when session & username changes!
    // if (session) getProfile();
    if (session) getUsers();
  }, [session]); // add users – is this the cause of the delay?

  async function getUsers() {
    // fetch global users from DB
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, full_name")
      .neq("id", session.user.id)
      .order("full_name", { ascending: true });
    if (error) console.log(error.message);
    setUsers(data ?? []);
  }
  return (
    <View style={styles.container}>
      {/* <Text>{session.user.id}</Text> */}
      <FlashList
        data={users}
        renderItem={({ item }) => (
          <Link
            style={styles.fullwidth}
            href={{
              pathname: "/user",
              params: {
                friendID: item.id,
                userID: session.user.id,
              },
            }}
          >
            <Text style={styles.userText}>
              {item.full_name} ({item.username})
            </Text>
          </Link>
        )}
        estimatedItemSize={100}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fullwidth: {
    width: "97%",
    backgroundColor: "white",
    padding: 10,
    margin: 3,
    borderRadius: 15, // Adjust the value based on your preference for roundness
    borderWidth: 2, // Border width
    borderColor: "black",
  },
  user: {
    width: "100%",
    backgroundColor: "white",
    padding: 10,
    // margin: 3,
  },
  userText: {
    fontSize: 15,
  },
  container: {
    padding: 8,
    height: "100%",
    width: "100%",
    backgroundColor: "white",
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
