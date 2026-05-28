import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
// Importações do Firebase
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; 

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = () => {
    if (!email || !senha) {
      Alert.alert('Aviso', 'Preencha o e-mail e a senha.');
      return;
    }

    signInWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {
        router.replace('/home');
      })
      .catch((error) => {
        Alert.alert('Acesso Negado', 'E-mail ou senha incorretos.');
      });
  };

  return (
    <View style={styles.container}>
     
      <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>ARCADE ASCENT</Text>
      <Text style={styles.subtitle}>GIFT CARDS DE JOGOS E CRÉDITOS</Text>

      <View style={styles.form}>
        
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon} accessible={false}>✉️</Text>
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            accessibilityLabel="Campo de texto para E-mail"
          />
        </View>
        
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon} accessible={false}>🔒</Text>
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#888"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
            accessibilityLabel="Campo de texto para Senha"
          />
        </View>

        <TouchableOpacity 
          onPress={() => router.push('/esqueci-senha')}
          accessibilityRole="link"
          accessibilityLabel="Ir para a tela de recuperar senha"
        >
          <Text style={styles.link}>Esqueci minha senha</Text>
        </TouchableOpacity>
        
        <View style={styles.espacoEsqueciSenha} />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin}
          accessibilityRole="button"
          accessibilityLabel="Botão para Entrar"
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem uma conta? </Text>
          <TouchableOpacity 
            onPress={() => router.push('/cadastro')}
            accessibilityRole="link"
            accessibilityLabel="Ir para a tela de cadastro"
          >
            <Text style={styles.link}>cadastre-se aqui!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', padding: 20 },
  logo: { width: 120, height: 120, marginBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0085A1' },
  subtitle: { fontSize: 12, color: '#666', marginBottom: 40 },
  form: { width: '100%', maxWidth: 350 },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    height: 50
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 12,
    color: '#333'
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    height: '100%'
  },
  
  espacoEsqueciSenha: { height: 30 }, 
  button: { backgroundColor: '#0085A1', padding: 15, borderRadius: 25, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: '#666', fontSize: 14 },
  link: { color: '#0085A1', fontWeight: 'bold', fontSize: 14, textDecorationLine: 'underline', alignSelf: 'flex-start' }
});