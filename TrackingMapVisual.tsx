import MapView, { Marker, Polyline, PROVIDER_GOOGLE, type Region } from "react-native-maps";
import { Image, Platform, Pressable, StyleSheet, View } from "react-native";

type LatLng = { latitude: number; longitude: number };

type Props = {
  van: LatLng | null;
  customer: LatLng;
  heading?: number;
  route?: LatLng[];
  delayed?: boolean;
  onRecenter?: () => void;
};

const VAN = require("./assets/tracking-van-marker@3x.png");

export function TrackingMapVisual({ van, customer, heading = 0, route = [], delayed, onRecenter }: Props) {
  const initial: Region = {
    latitude: customer.latitude,
    longitude: customer.longitude,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  };
  const stroke = delayed ? "#F0A43A" : "#3AD7FF";
  const glow = delayed ? "rgba(240, 164, 58, 0.22)" : "rgba(58, 215, 255, 0.22)";

  return (
    <View style={styles.fill}>
      <MapView
        style={styles.fill}
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        initialRegion={initial}
        region={
          van
            ? { latitude: van.latitude, longitude: van.longitude, latitudeDelta: 0.02, longitudeDelta: 0.02 }
            : undefined
        }
      >
        {route.length > 1 ? (
          <Polyline coordinates={route} strokeColor={glow} strokeWidth={10} />
        ) : null}
        {route.length > 1 ? (
          <Polyline coordinates={route} strokeColor={stroke} strokeWidth={4} />
        ) : null}
        <Marker coordinate={customer} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
          <View style={styles.customer} />
        </Marker>
        {van ? (
          <Marker coordinate={van} anchor={{ x: 0.5, y: 0.5 }} flat rotation={heading} tracksViewChanges={false}>
            <Image source={VAN} style={styles.van} />
          </Marker>
        ) : null}
      </MapView>
      <Pressable style={styles.recenter} onPress={onRecenter} accessibilityLabel="Recenter" />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: "#070D18" },
  van: { width: 17, height: 36 },
  customer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#3AD7FF",
    borderWidth: 3,
    borderColor: "#F3F7FB",
  },
  recenter: {
    position: "absolute",
    end: 12,
    bottom: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(12, 20, 34, 0.9)",
    borderWidth: 1,
    borderColor: "#1C2D48",
  },
});
