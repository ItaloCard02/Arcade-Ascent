import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Clipboard from 'expo-clipboard'; 
import Header from '../components/Header';

// Integrações do Firebase
import { auth, db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function PixScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const nomeJogo = params.nome || 'Jogo Selecionado';
  const plataformaJogo = params.plataforma || 'PC';
  const precoNovo = params.precoNovo || '00,00';

  const [numeroPedido, setNumeroPedido] = useState('');
  useEffect(() => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    setNumeroPedido(`#${randomNum}`);
  }, []);

  const codigoPixCopiaECola = "00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426655440000520400005303986540550.005802BR5913Arcade Ascent6008BRASILIA62070503***";

  const copiarParaAreaTransferencia = async () => {
    await Clipboard.setStringAsync(codigoPixCopiaECola);
    if (Platform.OS === 'web') {
      window.alert('Copiado!\n\nCódigo PIX copiado com sucesso.');
    } else {
      Alert.alert('Copiado!', 'Código PIX copiado com sucesso.');
    }
  };

  // CREATE: Salva a compra no banco de dados Firebase
  const finalizarCompra = async () => {
    try {
      const user = auth.currentUser;
      
      if (user) {
        // Cria um documento na coleção 'jogos' dentro do ID do usuário
        await addDoc(collection(db, 'usuarios', user.uid, 'jogos'), {
          nome: nomeJogo,
          plataforma: plataformaJogo,
          status: 'Na fila', 
          dataCompra: new Date().toISOString()
        });
      }
      
      router.replace('/home');
    } catch (e) {
      console.log("Erro ao salvar a compra na nuvem", e);
      router.replace('/home');
    }
  };

  return (
    <ScrollView style={styles.mainScroll} contentContainerStyle={{ paddingBottom: 60 }}>
      <Header mostrarVoltar={true} />

      <View style={styles.contentContainer}>
        <Text style={styles.tituloPagina}>Pagamento PIX</Text>

        <View style={styles.card}>
          <Text style={styles.nomeProduto}>{nomeJogo}</Text>
          <Text style={styles.plataformaProduto}>{plataformaJogo}</Text>
          <View style={styles.linhaDivisoria} />
          <View style={styles.rowTotal}>
            <Text style={styles.textoTotal}>Total do Pedido ({numeroPedido}):</Text>
            <Text style={styles.valorTotal}>R$ {precoNovo}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.instrucaoTexto}>1. Abra o app do seu banco.</Text>
          <Text style={styles.instrucaoTexto}>2. Escolha pagar via PIX (QR Code ou Copia e Cola).</Text>
          
          <View style={styles.qrCodeContainer}>
            <Image 
              source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${codigoPixCopiaECola}` }} 
              style={styles.imagemQrCode} 
              resizeMode="contain"
            />
          </View>
          
          <Text style={styles.instrucaoTextoCentrada}>Ou use o PIX Copia e Cola:</Text>
          
          <TouchableOpacity style={styles.campoCopiaECola} onPress={copiarParaAreaTransferencia}>
            <Text style={styles.textoPixOculto} numberOfLines={1}>{codigoPixCopiaECola}</Text>
            <Text style={styles.botaoCopiarTexto}>📋 Copiar</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.botaoFinalizar} onPress={finalizarCompra}>
          <Text style={styles.textoBotaoFinalizar}>Finalizar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainScroll: { flex: 1, backgroundColor: 'transparent', paddingTop: 40 },
  contentContainer: { paddingHorizontal: 20 },
  tituloPagina: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 20 },
  card: { backgroundColor: '#1F293D', borderRadius: 12, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: '#2A364F', alignItems: 'center' },
  nomeProduto: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', alignSelf: 'flex-start' },
  plataformaProduto: { fontSize: 14, color: '#A0B2D8', marginTop: 5, textTransform: 'uppercase', fontWeight: 'bold', alignSelf: 'flex-start' },
  linhaDivisoria: { height: 1, width: '100%', backgroundColor: '#2A364F', marginVertical: 15 },
  rowTotal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  textoTotal: { fontSize: 14, color: '#FFFFFF' },
  valorTotal: { fontSize: 22, color: '#00FF00', fontWeight: 'bold' },
  instrucaoTexto: { fontSize: 14, color: '#A0B2D8', alignSelf: 'flex-start', marginBottom: 5 },
  instrucaoTextoCentrada: { fontSize: 15, color: '#FFFFFF', marginTop: 20, marginBottom: 10, fontWeight: 'bold' },
  qrCodeContainer: { backgroundColor: '#FFFFFF', padding: 15, borderRadius: 10, marginTop: 15, alignItems: 'center', justifyContent: 'center' },
  imagemQrCode: { width: 150, height: 150 },
  campoCopiaECola: { flexDirection: 'row', backgroundColor: '#2A364F', borderRadius: 8, padding: 12, alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: 5 },
  textoPixOculto: { color: '#A0B2D8', flex: 1, marginRight: 10, fontSize: 12 },
  botaoCopiarTexto: { color: '#00FF00', fontWeight: 'bold', fontSize: 14 },
  botaoFinalizar: { backgroundColor: '#00FF00', width: '100%', padding: 15, borderRadius: 25, alignItems: 'center', marginTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 4 },
  textoBotaoFinalizar: { color: '#000000', fontWeight: 'bold', fontSize: 18 }
});