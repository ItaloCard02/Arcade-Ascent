import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Alert, Platform } from 'react-native';
import Header from '../components/Header';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export default function ContaScreen() {
  const [email, setEmail] = useState('');
  const [imagemPerfil, setImagemPerfil] = useState<string | null>(null);
  
  const nomeUsuario = "Italo";
  const loginUsuario = "italo_suporte";

  
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const fotoSalva = await AsyncStorage.getItem('@foto_perfil');
        const emailSalvo = await AsyncStorage.getItem('@email_recuperacao');
        
        if (fotoSalva) setImagemPerfil(fotoSalva);
        if (emailSalvo) setEmail(emailSalvo);
      } catch (e) {
        console.log("Erro ao carregar os dados", e);
      }
    };
    
    carregarDados();
  }, []); 

  
  const salvarAlteracoes = async () => {
    try {
      if (imagemPerfil) {
        await AsyncStorage.setItem('@foto_perfil', imagemPerfil);
      }
      await AsyncStorage.setItem('@email_recuperacao', email);
      
      if (Platform.OS === 'web') {
        window.alert('Sucesso!\n\nSuas informações foram salvas no aplicativo.');
      } else {
        Alert.alert('Sucesso!', 'Suas informações foram salvas no aplicativo.');
      }
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar os dados.');
    }
  };

  
  const escolherImagem = () => {
    if (Platform.OS === 'web') {
      abrirGaleria();
      return;
    }

    Alert.alert("Foto de Perfil", "Escolha de onde deseja carregar sua foto:", [
      { text: "Câmera", onPress: abrirCamera },
      { text: "Galeria de Fotos", onPress: abrirGaleria },
      { text: "Cancelar", style: "cancel" }
    ]);
  };

  const abrirCamera = async () => {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (permissao.granted === false) {
      Alert.alert("Acesso Negado", "Você precisa permitir o acesso à câmera.");
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!resultado.canceled) {
      setImagemPerfil(resultado.assets[0].uri);
    }
  };

  const abrirGaleria = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissao.granted === false) {
      Alert.alert("Acesso Negado", "Você precisa permitir o acesso à galeria.");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!resultado.canceled) {
      setImagemPerfil(resultado.assets[0].uri);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Header mostrarVoltar={true} />

      <View style={styles.content}>
        
        <View style={styles.perfilHeader}>
          <TouchableOpacity style={styles.fotoContainer} onPress={escolherImagem}>
            {imagemPerfil ? (
              <Image source={{ uri: imagemPerfil }} style={styles.fotoCirculoImagem} />
            ) : (
              <View style={styles.fotoCirculo}>
                <Text style={styles.iconeCamera}>📷</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.saudacao}>Olá, {nomeUsuario}</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Login da Conta</Text>
          <TextInput style={[styles.input, styles.inputBloqueado]} value={loginUsuario} editable={false} />

          <Text style={styles.label}>Senha</Text>
          <TextInput style={[styles.input, styles.inputBloqueado]} value="********" secureTextEntry={true} editable={false} />

          <Text style={styles.label}>E-mail de Recuperação</Text>
          <TextInput style={styles.input} placeholder="Digite seu e-mail aqui..." value={email} onChangeText={setEmail} keyboardType="email-address" />

          
          <TouchableOpacity style={styles.botaoSalvar} onPress={salvarAlteracoes}>
            <Text style={styles.textoBotaoSalvar}>Salvar Alterações</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent', paddingTop: 40 },
  content: { paddingHorizontal: 20, alignItems: 'center' },
  perfilHeader: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  fotoContainer: { marginBottom: 15 },
  fotoCirculo: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#0085A1' },
  iconeCamera: { fontSize: 40 },
  fotoCirculoImagem: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#0085A1' },
  saudacao: { fontSize: 24, fontWeight: 'bold', color: '#000' },
  formContainer: { width: '100%', maxWidth: 400 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 5, marginLeft: 5 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 15, marginBottom: 20, fontSize: 14, backgroundColor: '#fff' },
  inputBloqueado: { backgroundColor: '#F5F5F5', color: '#888', borderColor: '#E0E0E0' },
  botaoSalvar: { backgroundColor: '#0085A1', padding: 15, borderRadius: 25, alignItems: 'center', marginTop: 10 },
  textoBotaoSalvar: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});