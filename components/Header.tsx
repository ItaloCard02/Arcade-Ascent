import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Image } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Header({ mostrarVoltar = false }) {
  const router = useRouter();
  
  const [menuVisivel, setMenuVisivel] = useState(false);
  const [menuPerfilVisivel, setMenuPerfilVisivel] = useState(false);
  const [fotoNoHeader, setFotoNoHeader] = useState<string | null>(null);
  
  // Estado para a barra de pesquisa
  const [termoBusca, setTermoBusca] = useState('');

  const carregarFotoPerfil = async () => {
    try {
      const fotoSalva = await AsyncStorage.getItem('@foto_perfil');
      if (fotoSalva) {
        setFotoNoHeader(fotoSalva);
      } else {
        setFotoNoHeader(null); 
      }
    } catch (e) {
      console.log("Erro ao ler foto no Header", e);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      carregarFotoPerfil();
    }, [])
  );

  // Função da barra de pesquisa inteligente
  const realizarBusca = () => {
    if (termoBusca.trim() !== '') {
      router.push({ pathname: '/home', params: { busca: termoBusca } });
    } else {
      router.push('/home');
    }
  };

  return (
    <>
      <View style={styles.header}>
        {mostrarVoltar && (
          <TouchableOpacity onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar">
            <Text style={styles.iconBack}>←</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => setMenuVisivel(true)} accessibilityRole="button" accessibilityLabel="Menu lateral">
          <Text style={styles.iconMenu}>≡</Text>
        </TouchableOpacity>
        
        {/* BARRA DE PESQUISA RECUPERADA */}
        <View style={styles.searchBar}>
          <TextInput 
            placeholder="Buscar..." 
            style={styles.searchInput} 
            value={termoBusca}
            onChangeText={setTermoBusca}
            onSubmitEditing={realizarBusca} 
          />
          <TouchableOpacity onPress={realizarBusca} style={styles.btnLupa}>
            <Text>🔍</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => setMenuPerfilVisivel(true)} accessibilityRole="button" accessibilityLabel="Menu de perfil">
          {fotoNoHeader ? (
            <Image 
              source={{ uri: fotoNoHeader }} 
              style={styles.fotoPerfilHeader} 
            />
          ) : (
            <Text style={styles.iconProfile}>👤</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* MENU LATERAL RECUPERADO (Com os links corretos) */}
      <Modal visible={menuVisivel} transparent={true} animationType="fade" onRequestClose={() => setMenuVisivel(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.menuLateralBox}>
            <TouchableOpacity style={styles.botaoFecharMenu} onPress={() => setMenuVisivel(false)}>
              <Text style={styles.textoFecharMenu}>X</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.itemMenuLateral} onPress={() => { setMenuVisivel(false); router.push('/home'); }}>
              <Text style={styles.textoItemMenu}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.itemMenuLateral} onPress={() => { setMenuVisivel(false); router.push({ pathname: '/home', params: { categoria: 'PC' } }); }}>
              <Text style={styles.textoItemMenu}>PC</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.itemMenuLateral} onPress={() => { setMenuVisivel(false); router.push({ pathname: '/home', params: { categoria: 'Console' } }); }}>
              <Text style={styles.textoItemMenu}>Console</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.itemMenuLateral} onPress={() => { setMenuVisivel(false); router.push('/sobre'); }}>
              <Text style={styles.textoItemMenu}>Sobre</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.areaTransparente} activeOpacity={1} onPress={() => setMenuVisivel(false)} />
        </View>
      </Modal>

      {/* MENU DE PERFIL RECUPERADO (Com o link da Biblioteca) */}
      <Modal visible={menuPerfilVisivel} transparent={true} animationType="none" onRequestClose={() => setMenuPerfilVisivel(false)}>
        <TouchableOpacity style={styles.modalPerfilOverlay} activeOpacity={1} onPress={() => setMenuPerfilVisivel(false)}>
          <View style={styles.perfilDropdownContainer}>
            <TouchableOpacity style={styles.itemDropdownPerfil} onPress={() => { setMenuPerfilVisivel(false); router.push('/conta'); }}>
              <Text style={styles.textoItemDropdown}>Conta</Text>
            </TouchableOpacity>
            
            {/* O BOTÃO DA BIBLIOTECA VOLTOU PARA ACESSARMOS O FIREBASE */}
            <TouchableOpacity style={styles.itemDropdownPerfil} onPress={() => { setMenuPerfilVisivel(false); router.push('/biblioteca'); }}>
              <Text style={styles.textoItemDropdown}>Biblioteca</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.itemDropdownPerfil, { borderBottomWidth: 0 }]} onPress={() => { setMenuPerfilVisivel(false); router.replace('/login'); }}>
              <Text style={styles.textoItemDropdown}>Sair</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  iconBack: { fontSize: 30, color: '#000', marginRight: 15 },
  iconMenu: { fontSize: 30, color: '#000' },
  iconProfile: { fontSize: 24, color: '#000' },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginHorizontal: 15, paddingHorizontal: 10, height: 40, backgroundColor: '#fff' },
  searchInput: { flex: 1, marginRight: 5, color: '#000' },
  btnLupa: { padding: 5 },
  fotoPerfilHeader: { width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: '#0085A1'},
  modalOverlay: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  areaTransparente: { flex: 1 },
  menuLateralBox: { width: '65%', backgroundColor: '#FFFFFF', height: '100%', paddingTop: 50, paddingHorizontal: 20, elevation: 5, shadowColor: '#000', shadowOffset: { width: 2, height: 0 }, shadowOpacity: 0.5, shadowRadius: 5 },
  botaoFecharMenu: { alignSelf: 'flex-end', marginBottom: 30, padding: 10 },
  textoFecharMenu: { fontSize: 22, fontWeight: 'bold', color: '#000' },
  itemMenuLateral: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EEEEEE' },
  textoItemMenu: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  modalPerfilOverlay: { flex: 1, backgroundColor: 'transparent', alignItems: 'flex-end', paddingTop: 55, paddingHorizontal: 20 },
  perfilDropdownContainer: { backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#CCCCCC', width: 140, padding: 5, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
  itemDropdownPerfil: { paddingVertical: 10, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#EEEEEE' },
  textoItemDropdown: { fontSize: 16, color: '#000000', fontWeight: '500' },
});