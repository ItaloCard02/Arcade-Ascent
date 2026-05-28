import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { useFocusEffect } from 'expo-router';
import Header from '../components/Header';

// Integrações do Firebase (CRUD REAL)
import { auth, db } from '../firebaseConfig';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function BibliotecaScreen() {
  const [jogosComprados, setJogosComprados] = useState<any[]>([]);

  const imagensJogos: Record<string, any> = {
    'Plants VS Zombies': require('../assets/pvz.jpg'),
    'Halo Infinite': require('../assets/halo.jpg'),
    'Super Mario Odyssey': require('../assets/mario.png'),
    'God of War Ragnarok': require('../assets/gow.jpg'),
    'Kingdom Hearts 2': require('../assets/kh2.jpeg'),
  };

  // READ: Busca todos os jogos vinculados ao usuário direto da Nuvem do Google
  const carregarBiblioteca = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return; // Se não estiver logado, não busca nada

      const querySnapshot = await getDocs(collection(db, 'usuarios', user.uid, 'jogos'));
      const jogos: any[] = [];
      
      querySnapshot.forEach((doc) => {
        // Pega a ID do documento no banco e junta com os dados do jogo
        jogos.push({ id: doc.id, ...doc.data() });
      });
      
      setJogosComprados(jogos);
    } catch (e) {
      console.log("Erro ao buscar no Firestore", e);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      carregarBiblioteca();
    }, [])
  );

  // UPDATE: Altera o campo "status" de um jogo específico no banco de dados
  const alterarStatus = async (jogoId: string, statusAtual: string) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      let novoStatus = 'Na fila';
      if (statusAtual === 'Na fila') novoStatus = 'Jogando';
      else if (statusAtual === 'Jogando') novoStatus = 'Finalizado';

      const jogoRef = doc(db, 'usuarios', user.uid, 'jogos', jogoId);
      await updateDoc(jogoRef, { status: novoStatus });
      
      carregarBiblioteca(); // Recarrega a tela para mostrar a mudança
    } catch (e) {
      console.log("Erro ao atualizar", e);
    }
  };

  // DELETE: Exclui o documento do jogo (Simulação de Reembolso)
  const deletarJogo = async (jogoId: string, nomeJogo: string) => {
    const executarDelete = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const jogoRef = doc(db, 'usuarios', user.uid, 'jogos', jogoId);
        await deleteDoc(jogoRef);
        carregarBiblioteca(); // Recarrega a tela removendo o item
      } catch (e) {
        console.log("Erro ao deletar", e);
      }
    };

    if (Platform.OS === 'web') {
      const confirmou = window.confirm(`Tem certeza que deseja solicitar o reembolso de ${nomeJogo}? O jogo será removido.`);
      if (confirmou) executarDelete();
    } else {
      Alert.alert('Reembolsar Jogo', `Tem certeza que deseja devolver ${nomeJogo}?`, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sim, devolver', style: 'destructive', onPress: executarDelete }
      ]);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const imagemJogo = imagensJogos[item.nome] || require('../assets/kh2.jpeg');

    // Define a cor do selo dependendo do status atual do jogo
    let corStatus = '#F39C12'; // Laranja (Na fila)
    if (item.status === 'Jogando') corStatus = '#3498DB'; // Azul
    if (item.status === 'Finalizado') corStatus = '#2ECC71'; // Verde

    return (
      <View style={styles.cardQuadrado}>
       
        <TouchableOpacity 
          style={styles.botaoDeletar} 
          onPress={() => deletarJogo(item.id, item.nome)}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          accessibilityRole="button"
          accessibilityLabel={`Devolver o jogo ${item.nome}`}
        >
          <Text style={styles.textoDeletar}>X</Text>
        </TouchableOpacity>

        
        <Image 
          source={imagemJogo} 
          style={styles.imagemJogo} 
          resizeMode="cover" 
          accessible={true}
          accessibilityLabel={`Capa do jogo ${item.nome}`}
        />
        
        <View style={styles.containerNome}>
          <Text style={styles.nomeJogo} numberOfLines={1}>{item.nome}</Text>
          
          {/* BOTÃO DE UPDATE */}
          <TouchableOpacity 
            style={[styles.badgeStatus, { backgroundColor: corStatus }]}
            onPress={() => alterarStatus(item.id, item.status)}
            accessibilityRole="button"
            accessibilityLabel={`Mudar o status do jogo. Status atual: ${item.status || 'Na fila'}`}
          >
            <Text style={styles.textoStatus}>{item.status || 'Na fila'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <FlatList
        style={styles.container}
        data={jogosComprados}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.rowGrid}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListHeaderComponent={() => (
          <>
            <Header mostrarVoltar={true} />
            <View style={styles.headerTitleContainer}>
              <Text style={styles.tituloPagina}>Minha Biblioteca</Text>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎮</Text>
            <Text style={styles.emptyText}>Você ainda não possui nenhum jogo na sua biblioteca.</Text>
          </View>
        )}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  headerTitleContainer: { paddingHorizontal: 20, marginBottom: 20 },
  tituloPagina: { fontSize: 24, fontWeight: 'bold', color: '#FFF', textShadowColor: '#000000', textShadowOffset: { width: 1.5, height: 1.5 }, textShadowRadius: 1 },
  rowGrid: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  
  cardQuadrado: { 
    width: '48%', 
    aspectRatio: 1, 
    backgroundColor: '#34A8DB', 
    borderRadius: 12, 
    overflow: 'hidden', 
    marginBottom: 15, 
    borderWidth: 1,
    borderColor: '#0085A1',
    elevation: 4
  },
  
  // Estilo do Botão de Delete
  botaoDeletar: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 0, 0, 0.85)',
    width: 25,
    height: 25,
    borderRadius: 12.5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: '#FFF'
  },
  textoDeletar: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  
  imagemJogo: { width: '100%', height: '100%', position: 'absolute' },
  
  containerNome: { 
    width: '100%', 
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.7)'
  },
  nomeJogo: { color: '#fff', fontSize: 12, fontWeight: 'bold', textAlign: 'center', marginBottom: 5 },
  
  // Estilo do Botão de Update
  badgeStatus: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#FFF' },
  textoStatus: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' },

  emptyContainer: { alignItems: 'center', justifyContent: 'center', padding: 40, marginTop: 40 },
  emptyIcon: { fontSize: 60, marginBottom: 15 },
  emptyText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', textAlign: 'center', textShadowColor: '#000000', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2 }
});