import Button from "@/components/button";
import ScreenWrapper from "@/components/screen-wrapper";
import Typo from "@/components/typo";
import { auth } from "@/config/firebase";
import { colors } from "@/constants/theme";
import { signOut } from "firebase/auth";
import { StyleSheet, Text } from "react-native";

// TODO: 3:39:26

const Home = () => {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <ScreenWrapper>
      <Text>Home</Text>
      <Button onPress={handleLogout}>
        <Typo color={colors.black}>Logout</Typo>
      </Button>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({});
