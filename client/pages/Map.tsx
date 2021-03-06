import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, Dimensions, ActivityIndicator, Pressable } from 'react-native';
import MapView from 'react-native-maps';
import { Div, Input, Text, Button, Icon, Avatar, Drawer } from 'react-native-magnus'
import * as Location from 'expo-location';
import { RootStackParamList } from '../RootStackParams';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { LocationObject } from 'expo-location';
import { Modal } from '../components/Modal';
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import LottieView from 'lottie-react-native';
import LocationSearch from '../components/LocationSearch';
import { DrawerButton } from '../components/DrawerButton';
import { DrawerContents } from '../components/DrawerContents';
import { DrawerRef } from 'react-native-magnus'

type mapScreenProp = StackNavigationProp<RootStackParamList, 'Map'>;

export function Map() {
    const [location, setLocation] = useState<null | LocationObject>(null);
    const [errorMsg, setErrorMsg] = useState<null | string>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const navigation = useNavigation<mapScreenProp>();

    const actionSheetRef = useRef<ActionSheet>(null);
    const drawerRef = useRef<DrawerRef>(null)

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    const sendToTest = () => {
        setIsLoading(true);
        // actionSheetRef.current?.setModalVisible();
        SheetManager.show("modal")
        setTimeout(() => {
            setIsLoading(false)
        }, 5000)
    }

    const sendToProfile = () => {
        navigation.navigate("Profile")
        drawerRef.current?.close()
    }

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    return (
        <Div style={styles.container} >
            {location === null ? (
                <Div flex={1} justifyContent="center" alignSelf="center">
                    <LottieView
                        style={styles.animation}
                        source={require('../assets/67056-spinner-edited.json')}
                        autoPlay
                        loop
                    />
                </Div>
            ) : (
                <Div>
                    <MapView initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }} showsUserLocation={true} style={styles.map} />
                    <Div row mt="25%" mb="20%" justifyContent="space-around" position="absolute" style={{ zIndex: 1000 }}>
                        <LocationSearch />
                        {/* {isLoading ? (
                            <Input
                                flex={6}
                                placeholder="Searching..."
                                textAlign='center'
                                color='black'
                                h={48}
                                ml="15%"
                                mr="15%"
                                px="md"
                                py="lg"
                                borderWidth={0}
                                rounded="circle"
                                shadow="lg"
                                shadowColor="black"
                                focusBorderColor="blue700"
                                suffix={<Icon name="x" color="black" fontFamily="Feather" fontSize="3xl" />} />
                        ) : (
                            <Input
                                flex={6}
                                placeholder="Search location"
                                ml="10%"
                                px="md"
                                py="lg"
                                borderWidth={0}
                                shadow="lg"
                                shadowColor="black"
                                focusBorderColor="blue700"
                                prefix={<Icon name="search" color="black" fontFamily="Feather" fontSize="3xl" />} />)
                        } */}

                        {isLoading ? null : (
                            // Menu Button
                            <>
                                <Drawer
                                    ref={drawerRef}
                                    children={
                                        <>
                                            <Div
                                                w="95%"
                                                h="100%"
                                            >
                                                {/* Close Drawer Button Container */}
                                                <Div
                                                    ml="5%"
                                                    mt="5%"
                                                    left={160}
                                                >
                                                    <Button
                                                        bg='transparent'
                                                        onPress={() => {
                                                            if (drawerRef.current) {
                                                                drawerRef.current.close();
                                                            }
                                                        }}
                                                    >
                                                        <Icon name='close' color="black" fontFamily="AntDesign" fontSize="4xl" />
                                                    </Button>
                                                </Div>
                                                <Div>
                                                    {/* Avatar container */}

                                                    <Div
                                                        ml="10%"
                                                        mt="5%"
                                                        left={130}
                                                    >
                                                        <Pressable
                                                            onPress={sendToProfile}
                                                        >
                                                            <Avatar
                                                                shadow={1}
                                                                bg="purp_primary"
                                                                size={55}
                                                            >
                                                                <Icon name="toilet" color="white" fontFamily="FontAwesome5" fontSize="3xl" />
                                                            </Avatar>
                                                        </Pressable>
                                                    </Div>
                                                    {/* Account name container */}
                                                    <Div
                                                        mt="5%"
                                                        left={110}
                                                    >
                                                        <Text
                                                            fontSize="xl"
                                                        >
                                                            Justin Chau
                                                        </Text>
                                                        <Text
                                                            color='gray500'
                                                        >
                                                            @chau_codes
                                                        </Text>
                                                    </Div>

                                                    {/* Buttons Container */}
                                                    <Div
                                                        mt="20%"
                                                        mr="10%"
                                                        alignItems='flex-end'
                                                    >

                                                        <Pressable
                                                            onPress={sendToProfile}
                                                        >
                                                            <Text
                                                                fontSize="2xl"
                                                                textAlign='left'
                                                            >
                                                                Profile
                                                            </Text>
                                                        </Pressable>

                                                        <Pressable>
                                                            <Text
                                                                mt="10%"

                                                                fontSize="2xl"
                                                            >
                                                                Favorites
                                                            </Text>
                                                        </Pressable>

                                                        <Pressable>
                                                            <Text
                                                                mt="10%"
                                                                fontSize="2xl"
                                                            >
                                                                Games
                                                            </Text>
                                                        </Pressable>

                                                        <Pressable>
                                                            <Text
                                                                mt="10%"
                                                                fontSize="2xl"
                                                            >
                                                                Friends
                                                            </Text>
                                                        </Pressable>

                                                    </Div>

                                                </Div>
                                                {/* Bottom Buttons Container */}
                                                <Div
                                                    row
                                                    bottom={-280}
                                                    left={140}
                                                >
                                                    <Button
                                                        bg='purp_primary'
                                                        borderless
                                                        shadow="3xl"
                                                        onPress={() => console.log("Log user out")}
                                                    >
                                                        <Text
                                                            color='white'
                                                        >
                                                            Logout
                                                        </Text>
                                                    </Button>
                                                </Div>
                                            </Div>
                                        </>
                                    }
                                    direction="right"
                                    animationTime={400}
                                    drawerPercentage={60}
                                />
                                <Button
                                    bg="white"
                                    h={50}
                                    w={50}
                                    ml="5%"
                                    mr="10%"
                                    rounded="circle"
                                    shadow="lg"
                                    borderless
                                    onPress={() => {
                                        if (drawerRef.current) {
                                            drawerRef.current.open();
                                        }
                                    }}
                                >
                                    <Icon name="menu" color="black" fontFamily="SimpleLineIcons" fontSize="3xl" />
                                </Button>
                            </>
                        )}
                    </Div>
                    <Div row position='absolute' bottom={-660} right={-5}>
                        <Button
                            bg="white"
                            h={50}
                            w={50}
                            ml="5%"
                            mr="10%"
                            rounded="circle"
                            shadow="lg"
                            borderless
                            onPress={() => sendToTest()}
                        >
                            <Icon name="location-arrow" color="blue" fontFamily="FontAwesome" fontSize="4xl" />
                        </Button>
                    </Div>
                    <Div row position="absolute" bottom={-740} right={50} style={{ zIndex: 1000 }} >
                        {isLoading ? (
                            <Div>
                                <Button
                                    px='xl'
                                    py='lg'
                                    w={300}
                                    h={48}
                                    bg='purp_primary'
                                    color='white'
                                    shadow="3xl"
                                    borderless
                                    fontSize="2xl"
                                    underlayColor='purp+primary'
                                    onPress={() => setIsLoading(false)}
                                >
                                    <LottieView
                                        style={styles.animationOne}
                                        source={require('../assets/67840-spinner.json')}
                                        autoPlay
                                        loop
                                    />
                                </Button>

                            </Div>
                        ) : (
                            <Button
                                px='xl'
                                py='lg'
                                w={300}
                                h={48}
                                bg='purp_primary'
                                color='white'
                                shadow="3xl"
                                borderless
                                fontSize="2xl"
                                underlayColor='purp+primary'
                                onPress={() => sendToTest()}
                            >
                                Find bathrooms near me
                            </Button>
                        )}

                        <Modal ref={actionSheetRef} />
                    </Div>
                </Div>
            )
            }
        </Div >
    )
}

const styles = StyleSheet.create({
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        position: "absolute"
    },
    container: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    animation: {
        width: 100,
        height: 100,
        backgroundColor: 'transparent',
    },
    animationOne: {
        width: 40,
        height: 40,
        backgroundColor: 'transparent',
    },
})