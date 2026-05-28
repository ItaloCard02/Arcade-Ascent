import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    // Envelopa tudo com a imagem de fundo
    <ImageBackground 
      source={require('../assets/fundo.avif')} 
      style={styles.fundoGeral}
      resizeMode="cover"
    >
      <Stack 
        screenOptions={{ 
          headerShown: false, // Esconde o cabeçalho padrão do Expo
          contentStyle: { backgroundColor: 'transparent' } 
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="cadastro" />
        <Stack.Screen name="home" />
        <Stack.Screen name="detalhes" />
      </Stack>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fundoGeral: {
    flex: 1,
    width: '100%',
    height: '100%',
  }
});