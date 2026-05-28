import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Header from '../components/Header';

export default function CarrinhoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  
  const nomeJogo = params.nome || 'Jogo Selecionado';
  const plataformaJogo = params.plataforma || 'PC';
  const precoNovo = params.precoNovo || '00,00';
  const precoAntigo = params.precoAntigo || '00,00';

 
  const [metodoPagamento, setMetodoPagamento] = useState('pix');
  
  const [cupom, setCupom] = useState('');

  return (
    <ScrollView style={styles.mainScroll} contentContainerStyle={{ paddingBottom: 40 }}>
      <Header mostrarVoltar={true} />

      <View style={styles.contentContainer}>
        <Text style={styles.tituloPagina}>Meu Carrinho</Text>

        
        <View style={styles.card}>
          {/* Cabeçalho do Card */}
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Produto</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.textoLimpar}>⊗ Limpar Carrinho</Text>
            </TouchableOpacity>
          </View>

          {/* Detalhes do Produto */}
          <View style={styles.produtoRow}>
            <View style={styles.produtoInfo}>
              <Text style={styles.nomeProduto}>{nomeJogo}</Text>
              <View style={styles.tagPlataforma}>
                <Text style={styles.textoTagPlataforma}>{plataformaJogo}</Text>
              </View>
            </View>
            <View style={styles.produtoPrecos}>
              <Text style={styles.precoAntigo}>R$ {precoAntigo}</Text>
              <Text style={styles.precoNovo}>R$ {precoNovo}</Text>
            </View>
          </View>
        </View>

        {/* --- BALÃO 2: CUPOM DE DESCONTO --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitleSub}>Possui um cupom de desconto?</Text>
          <View style={styles.cupomContainer}>
            <TextInput 
              style={styles.inputCupom} 
              placeholder="Insira o cupom" 
              placeholderTextColor="#999"
              value={cupom}
              onChangeText={setCupom}
            />
            <TouchableOpacity style={styles.botaoAplicar}>
              <Text style={styles.textoBotaoAplicar}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- BALÃO 3: FORMAS DE PAGAMENTO --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitleSub}>Formas de Pagamento</Text>

          {/* Opção: PIX */}
          <TouchableOpacity style={styles.opcaoPagamento} onPress={() => setMetodoPagamento('pix')}>
            <View style={[styles.radioCircle, metodoPagamento === 'pix' && styles.radioCircleAtivo]}>
              {metodoPagamento === 'pix' && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.textoPagamento}>PIX</Text>
          </TouchableOpacity>

          {/* Opção: Cartão de Crédito */}
          <TouchableOpacity style={styles.opcaoPagamento} onPress={() => setMetodoPagamento('cartao')}>
            <View style={[styles.radioCircle, metodoPagamento === 'cartao' && styles.radioCircleAtivo]}>
              {metodoPagamento === 'cartao' && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.textoPagamento}>Cartão de Crédito</Text>
          </TouchableOpacity>

          {/* Opção: Boleto */}
          <TouchableOpacity style={styles.opcaoPagamento} onPress={() => setMetodoPagamento('boleto')}>
            <View style={[styles.radioCircle, metodoPagamento === 'boleto' && styles.radioCircleAtivo]}>
              {metodoPagamento === 'boleto' && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.textoPagamento}>Boleto Bancário</Text>
          </TouchableOpacity>
        </View>

        {/* --- BALÃO 4: RESUMO E CONTINUAR --- */}
        <View style={styles.cardResumo}>
          <View style={styles.resumoRow}>
            <Text style={styles.textoResumoLabel}>Total</Text>
            <Text style={styles.textoResumoValor}>R$ {precoNovo}</Text>
          </View>

          <TouchableOpacity 
            style={styles.botaoContinuar}
            onPress={() => {
              if (metodoPagamento === 'pix') {
                router.push({
                  pathname: '/pix',
                  params: { nome: nomeJogo, plataforma: plataformaJogo, precoNovo: precoNovo }
                });
              } else {
                alert('Apenas o PIX está disponível para demonstração no momento.');
              }
            }}
          >
            <Text style={styles.textoBotaoContinuar}>Continuar</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainScroll: { flex: 1, backgroundColor: 'transparent', paddingTop: 40 },
  contentContainer: { paddingHorizontal: 15 },
  
  tituloPagina: { fontSize: 28, fontWeight: 'bold', color: '#000000', marginBottom: 20, marginLeft: 5 },

  // Estilo Base dos Balões (Cards)
  card: {
    backgroundColor: '#1E2638', 
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2A364F',
  },
  cardResumo: {
    backgroundColor: '#161D2B', 
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#2A364F',
  },

  // Header do Balão de Produto
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#2A364F', paddingBottom: 10, marginBottom: 15 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  cardTitleSub: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 15 },
  textoLimpar: { color: '#FF4C4C', fontSize: 14, fontWeight: 'bold' },

  // Linha do Produto
  produtoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  produtoInfo: { flex: 1 },
  nomeProduto: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
  tagPlataforma: { backgroundColor: '#2A364F', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 5, alignSelf: 'flex-start' },
  textoTagPlataforma: { color: '#A0B2D8', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  produtoPrecos: { alignItems: 'flex-end' },
  precoAntigo: { color: '#888888', textDecorationLine: 'line-through', fontSize: 14, marginBottom: 2 },
  precoNovo: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },

  // Cupom
  cupomContainer: { flexDirection: 'row', alignItems: 'center' },
  inputCupom: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 8, paddingHorizontal: 15, height: 45, fontSize: 16, color: '#000' },
  botaoAplicar: { backgroundColor: '#3B82F6', borderRadius: 8, paddingHorizontal: 20, height: 45, justifyContent: 'center', marginLeft: 10 },
  textoBotaoAplicar: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },

  // Formas de Pagamento
  opcaoPagamento: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2A364F', padding: 15, borderRadius: 8, marginBottom: 10 },
  radioCircle: { height: 20, width: 20, borderRadius: 10, borderWidth: 2, borderColor: '#A0B2D8', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  radioCircleAtivo: { borderColor: '#00FF00' },
  radioInner: { height: 10, width: 10, borderRadius: 5, backgroundColor: '#00FF00' },
  textoPagamento: { fontSize: 16, color: '#FFFFFF', fontWeight: '500' },

  // Resumo
  resumoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  textoResumoLabel: { fontSize: 18, color: '#FFFFFF', fontWeight: 'bold' },
  textoResumoValor: { fontSize: 24, color: '#FFFFFF', fontWeight: 'bold' },
  
  botaoContinuar: { backgroundColor: '#00FF00', paddingVertical: 15, borderRadius: 10, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3 },
  textoBotaoContinuar: { color: '#000000', fontSize: 20, fontWeight: 'bold' },
});