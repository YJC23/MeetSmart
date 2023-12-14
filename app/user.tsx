import React from "react"; // added line to fix issues w ts
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { StyleSheet, View, Pressable, Alert, Text } from "react-native";
import { Button, Input } from "react-native-elements";
import { Session } from "@supabase/supabase-js";
import { FlashList } from "@shopify/flash-list";
import { router, Link, useLocalSearchParams, Stack } from "expo-router";

export default function user() {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [datetime, setDatetime] = useState([]);

  const [name2, setName2] = useState("");
  const [username2, setUsername2] = useState("");
  const [datetime2, setDatetime2] = useState([]);

  const [common, setCommon] = useState([]);

  useEffect(() => {
    getProfile();
  }, [params]);

  function findCommonIndices(array1, array2) {
    const latest = Math.min(array1.length, array2.length);
    const commonIndices = [];
    for (let i = 0; i < latest; i++) {
      if (array1[i] === true && array2[i] === true) {
        // takes care of null?
        commonIndices.push(i);
      }
    }
    return commonIndices;
  }

  async function getProfile() {
    try {
      setLoading(true);
      const { data, error, status } = await supabase
        .from("profiles")
        .select("id, username, full_name, date_time")
        .in("id", [params.userID, params.friendID]);
      if (error && status !== 406) {
        throw error;
      }
      if (data) {
        // update fields
        setUsername(data[0].username);
        setName(data[0].full_name);
        setDatetime(data[0].date_time);

        setUsername2(data[1].username);
        setName2(data[1].full_name);
        setDatetime2(data[1].date_time);

        setCommon(findCommonIndices(data[0].date_time, data[1].date_time));
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const TimeSlot = ({ index }) => {
    const bothFree = datetime[index] & datetime2[index];
    return (
      <Pressable style={bothFree ? styles.on : styles.off}>
        <Text style={bothFree ? styles.onText : styles.offText}>
          {index % 8 < 4 ? (index % 8) + 9 : (index % 8) - 3}
          {index % 8 < 3 ? "AM" : "PM"}
        </Text>
      </Pressable>
    );
  };

  const days = ["Mon", "Tues", "Wed", "Thurs", "Fri"];
  return (
    <View style={styles.container}>
      {/* <Text> {params.userid} </Text> */}
      {/* <Text>{loading ? "Loading schedule..." : "Finshed loading!"}</Text> */}
      {/* <Text>{loading ? "Loading..." : `${name}'s schedule: ${datetime}`}</Text>
      <Text> Length: {datetime.length} </Text>
      <Text>
        {loading ? "Loading..." : `${name2}'s schedule: ${datetime2}`}
      </Text>
      <Text> Length: {datetime2.length} </Text>
      <Text></Text> */}

      <View style={styles.center}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {loading ? "Loading..." : "Available Timeslots for..."}
          </Text>
          <Text
            style={[
              styles.headerText,
              { fontStyle: "italic", fontWeight: "bold" },
            ]}
          >
            {loading ? "" : `${name} & ${name2}`}
          </Text>
        </View>
        <View>
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
        <View style={styles.options}>
          <Text style={styles.headerText}> First Ten Available Timeslots </Text>
          <View style={styles.columns}>
            <View
              style={common.length > 0 ? styles.timeslots : styles.invisible}
            >
              {common.length > 0 &&
                common.slice(0, 5).map((index, idx) => (
                  <Text key={index} style={styles.headerText}>
                    {idx + 1}
                    {" - "}
                    {days[Math.floor(index / 8)]}
                    {": "}
                    {index % 8 < 4 ? (index % 8) + 9 : (index % 8) - 3}
                    {index % 8 < 3 ? "am" : "pm"}
                  </Text>
                ))}
            </View>
            <View
              style={common.length > 5 ? styles.timeslots : styles.invisible}
            >
              {common.length > 5 &&
                common.slice(5, 10).map((index, idx) => (
                  <Text key={index} style={styles.headerText}>
                    {idx + 6}
                    {" - "}
                    {days[Math.floor(index / 8)]}
                    {": "}
                    {index % 8 < 4 ? (index % 8) + 9 : (index % 8) - 3}
                    {index % 8 < 3 ? "am" : "pm"}
                  </Text>
                ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  invisible: {
    backfaceVisibility: "hidden",
  },
  columns: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  timeslots: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    borderRadius: 15, // Adjust the value based on your preference for roundness
    borderWidth: 1, // Border width
    borderColor: "black",
    padding: 10,
    margin: 5,
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
  options: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "white",
    margin: 10,
  },
  header: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15, // Adjust the value based on your preference for roundness
    borderWidth: 2, // Border width
    borderColor: "black",
    padding: 10,
    marginBottom: 5,
  },
  headerText: {
    fontSize: 20,
    margin: 1,
  },
  center: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
    margin: 0,
    backgroundColor: "white",
  },
  container: {
    padding: 8,
    height: "100%",
    width: "100%",
    backgroundColor: "white",
  },
  mt20: {
    marginTop: 20,
  },
});
