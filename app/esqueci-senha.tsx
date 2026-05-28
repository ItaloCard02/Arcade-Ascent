import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';

export default function EsqueciSenhaScreen() {
  const router = useRouter();
  
  
  const [email, setEmail] = useState('');
  const [linkEnviado, setLinkEnviado] = useState(false);

  const handleEnviar = () => {
    // Validação básica do email antes de enviar
    if (!email.includes('@') || !email.includes('.')) {
      if (Platform.OS === 'web') {
        window.alert('Erro\n\nPor favor, insira um e-mail válido.');
      } else {
        Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
      }
      return;
    }

    
    setLinkEnviado(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>{'<-'}</Text>
      </TouchableOpacity>

      <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Esqueci minha senha</Text>

      <View style={styles.form}>
        
        {!linkEnviado ? (
          <>
            <Text style={styles.descricao}>
              Insira o endereço de e-mail da conta, para enviarmos um link de recuperação.
            </Text>
            
            <TextInput 
              style={styles.input} 
              placeholder="E-mail (Exemplo: seunome@gmail.com)" 
              keyboardType="email-address" 
              value={email} 
              onChangeText={setEmail} 
            />
            
            <TouchableOpacity style={styles.button} onPress={handleEnviar}>
              <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
          </>
        ) : (
          
          <>
            <Text style={styles.mensagemSucesso}>
              Enviamos um link para seu E-mail!
            </Text>
            
            <TouchableOpacity style={styles.button} onPress={() => router.back()}>
              <Text style={styles.buttonText}>Retornar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: 'transparent', alignItems: 'center', padding: 20, paddingTop: 50 },
  backButton: { alignSelf: 'flex-start', marginBottom: 20 },
  backText: { fontSize: 24, color: '#333', fontWeight: 'bold' },
  logo: { width: 100, height: 100, marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000', marginBottom: 10 },
  form: { width: '100%', maxWidth: 350, alignItems: 'center' },
  descricao: { fontSize: 14, color: '#333', textAlign: 'center', marginBottom: 20 },
  mensagemSucesso: { fontSize: 18, color: '#0085A1', fontWeight: 'bold', textAlign: 'center', marginBottom: 30, marginTop: 20 },
  input: { width: '100%', borderWidth: 1, borderColor: '#000000', borderRadius: 8, padding: 15, marginBottom: 15, fontSize: 14, color: '#000', backgroundColor: '#fff' },
  button: { width: '100%', backgroundColor: '#0085A1', padding: 15, borderRadius: 25, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});