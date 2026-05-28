import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
// Importações do Firebase
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; 

export default function CadastroScreen() {
  const router = useRouter();
  
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  // Novo estado para controlar o efeito de carregamento visual
  const [carregando, setCarregando] = useState(false);

  const handleCadastro = () => {
    if (!usuario || !email || !senha || !confirmarSenha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    // Trava o botão e mostra a rodinha de carregamento
    setCarregando(true);

    createUserWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {
        setCarregando(false);
        Alert.alert('Sucesso!', 'Conta criada com sucesso!');
        router.replace('/home'); 
      })
      .catch((error) => {
        setCarregando(false); // Destrava o botão se der erro
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Erro', 'Esse e-mail já está cadastrado.');
        } else if (error.code === 'auth/weak-password') {
          Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
        } else {
          Alert.alert('Erro', error.message);
        }
      });
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container} 
      showsVerticalScrollIndicator={false}
      // A MÁGICA AQUI: Permite clicar no botão logo de primeira, mesmo com o teclado aberto!
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Voltar para a tela anterior"
      >
        <Text style={styles.backText}>{'<-'}</Text>
      </TouchableOpacity>

      <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Criar Conta</Text>

      <View style={styles.form}>
        
        {/* INPUT NOME DE USUÁRIO */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon} accessible={false}>👤</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Nome de Usuário" 
            placeholderTextColor="#888"
            value={usuario} 
            onChangeText={setUsuario} 
            accessibilityLabel="Campo de texto para Nome de Usuário"
          />
        </View>

        {/* INPUT E-MAIL */}
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

        {/* INPUT SENHA */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon} accessible={false}>🔒</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Senha (Mín. 6 caracteres)" 
            placeholderTextColor="#888"
            secureTextEntry 
            value={senha} 
            onChangeText={setSenha} 
            accessibilityLabel="Campo de texto para definir Senha"
          />
        </View>

        {/* INPUT CONFIRMAR SENHA */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon} accessible={false}>🔒</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Confirmar senha" 
            placeholderTextColor="#888"
            secureTextEntry 
            value={confirmarSenha} 
            onChangeText={setConfirmarSenha} 
            accessibilityLabel="Campo de texto para Confirmar a Senha"
          />
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleCadastro}
          disabled={carregando} // Impede duplo clique enquanto processa
          accessibilityRole="button"
          accessibilityLabel="Botão para continuar e criar conta"
        >
          {/* Se estiver carregando, mostra o ActivityIndicator, senão, mostra o texto normal */}
          {carregando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Continuar</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: 'transparent', alignItems: 'center', padding: 20, paddingTop: 50 },
  backButton: { alignSelf: 'flex-start', marginBottom: 20 },
  backText: { fontSize: 24, color: '#333', fontWeight: 'bold' },
  logo: { width: 100, height: 100, marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000', marginBottom: 30 },
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
  
  button: { backgroundColor: '#0085A1', padding: 15, borderRadius: 25, alignItems: 'center', marginTop: 10, minHeight: 50, justifyContent: 'center' },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }
});