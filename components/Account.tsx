import React from "react"; // added line to fix issues w ts
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { StyleSheet, View, Pressable, Alert, Text } from "react-native";
import { Button, Input } from "react-native-elements";
import { Session } from "@supabase/supabase-js";
import { router, Link, useLocalSearchParams, Stack } from "expo-router";

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState([]);
  const [users, setUsers] = useState<
    { id: string; username: string; full_name: string }[]
  >([]);

  useEffect(() => {
    // re-render when session & username changes!
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, full_name, date_time`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }
      if (data) {
        // if there's data set username, website (input fields)
        setUsername(data.username);
        setDatetime(data.date_time);
        setName(data.full_name);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    full_name,
    date_time,
  }: {
    username: string;
    full_name: string;
    date_time: any[];
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        username,
        full_name,
        date_time,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  function editSchedule(index) {
    const updatedDatetime = [...datetime];
    updatedDatetime[index] = !updatedDatetime[index];
    setDatetime(updatedDatetime);
  }

  const TimeSlot = ({ index }) => {
    return (
      <Pressable
        style={datetime[index] ? styles.on : styles.off}
        onPress={() => editSchedule(index)}
      >
        <Text style={datetime[index] ? styles.onText : styles.offText}>
          {index % 8 < 4 ? (index % 8) + 9 : (index % 8) - 3}
          {index % 8 < 3 ? "AM" : "PM"}
        </Text>
      </Pressable>
    );
  };

  const Calendar = () => {
    return (
      <View style={styles.Schedule}>
        <Text style={styles.header}> Weekly Schedule</Text>
        {/* <Text>{loading ? "Loading..." : `${datetime}`}</Text> */}
        <View style={styles.weekContainer}>
          <View style={styles.dayContainer}>
            <Text>Mon</Text>
            <TimeSlot index={0} />
            <TimeSlot index={1} />
            <TimeSlot index={2} />
            <TimeSlot index={3} />
            <TimeSlot index={4} />
            <TimeSlot index={5} />
            <TimeSlot index={6} />
            <TimeSlot index={7} />
          </View>
          <View style={styles.dayContainer}>
            <Text>Tues</Text>
            <TimeSlot index={8} />
            <TimeSlot index={9} />
            <TimeSlot index={10} />
            <TimeSlot index={11} />
            <TimeSlot index={12} />
            <TimeSlot index={13} />
            <TimeSlot index={14} />
            <TimeSlot index={15} />
          </View>
          <View style={styles.dayContainer}>
            <Text>Wed</Text>
            <TimeSlot index={16} />
            <TimeSlot index={17} />
            <TimeSlot index={18} />
            <TimeSlot index={19} />
            <TimeSlot index={20} />
            <TimeSlot index={21} />
            <TimeSlot index={22} />
            <TimeSlot index={23} />
          </View>
          <View style={styles.dayContainer}>
            <Text>Thurs</Text>
            <TimeSlot index={24} />
            <TimeSlot index={25} />
            <TimeSlot index={26} />
            <TimeSlot index={27} />
            <TimeSlot index={28} />
            <TimeSlot index={29} />
            <TimeSlot index={30} />
            <TimeSlot index={31} />
          </View>
          <View style={styles.dayContainer}>
            <Text>Fri</Text>
            <TimeSlot index={32} />
            <TimeSlot index={33} />
            <TimeSlot index={34} />
            <TimeSlot index={35} />
            <TimeSlot index={36} />
            <TimeSlot index={37} />
            <TimeSlot index={38} />
            <TimeSlot index={39} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.verticallySpaced}>
        <Input
          label="Username"
          value={username || ""}
          onChangeText={(text) => setUsername(text)}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Full Name"
          value={name || ""}
          onChangeText={(text) => setName(text)}
        />
      </View>

      <Calendar />

      <View style={[styles.verticallySpaced, styles.mt10]}>
        <Button
          title={loading ? "Loading ..." : "Update"}
          onPress={() =>
            updateProfile({ username, full_name: name, date_time: datetime })
          }
          disabled={loading}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Schedule: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 20,
  },
  weekContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dayContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: 2,
  },
  on: {
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 10,
    borderRadius: 5,
    margin: 1,
  },
  off: {
    backgroundColor: "#D3D3D3",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 10,
    borderRadius: 5,
    margin: 1,
  },
  onText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  offText: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
  container: {
    marginTop: 0,
    padding: 8,
    backgroundColor: "white",
    height: "100%",
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt10: {
    marginTop: 8,
  },
});
