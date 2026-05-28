import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Header from '../components/Header';

export default function HomeScreen() {
  const router = useRouter();
  
  
  const { categoria, busca } = useLocalSearchParams();
  
  const [slideAtual, setSlideAtual] = useState(0);

  
  const listaDeJogos = [
    { id: '1', nome: 'Plants VS Zombies', plataforma: 'Steam', tag: 'PC', preco: '20,99', precoAntigo: '40,00', desconto: '-50%', imagem: require('../assets/pvz.jpg') },
    { id: '2', nome: 'Halo Infinite', plataforma: 'Playstation 5', tag: 'Console', preco: '200,00', precoAntigo: '250,00', desconto: '-20%', imagem: require('../assets/halo.jpg') },
    { id: '3', nome: 'Super Mario Odyssey', plataforma: 'Nintendo Switch', tag: 'Console', preco: '300,00', precoAntigo: '350,00', desconto: '-15%', imagem: require('../assets/mario.png') },
    { id: '4', nome: 'God of War Ragnarok', plataforma: 'XBOX Series X', tag: 'Console', preco: '250,00', precoAntigo: '300,00', desconto: '-16%', imagem: require('../assets/gow.jpg') },
    { id: '5', nome: 'Kingdom Hearts 2', plataforma: 'Steam', tag: 'PC', preco: '48,00', precoAntigo: '160,00', desconto: '-70%', imagem: require('../assets/kh2.jpeg') }
  ];

  const totalSlides = listaDeJogos.length; 
  const proximoSlide = () => setSlideAtual((prev) => (prev + 1) % totalSlides);
  const slideAnterior = () => setSlideAtual((prev) => (prev - 1 + totalSlides) % totalSlides);

  
  const jogoNoBanner = listaDeJogos[slideAtual];

  
  let jogosFiltrados = listaDeJogos;

  if (categoria) {
    jogosFiltrados = jogosFiltrados.filter(jogo => jogo.tag === categoria);
  }

  if (busca) {
    const termoStr = Array.isArray(busca) ? busca[0] : busca;
    const termoBusca = termoStr.toLowerCase();
    jogosFiltrados = jogosFiltrados.filter(jogo => 
      jogo.nome.toLowerCase().includes(termoBusca)
    );
  }

 
  let tituloSecao = 'Destaques da Semana';
  if (busca) {
    tituloSecao = `Resultados para "${busca}"`;
  } else if (categoria) {
    tituloSecao = `Jogos para ${categoria}`;
  }

  const renderHeader = () => (
    <>
      <Header />

      <View style={styles.carouselContainer}>
        
        <TouchableOpacity 
          style={styles.bannerWrapper}
          activeOpacity={0.8}
          onPress={() => router.push({ 
            pathname: '/detalhes', 
            params: { id: jogoNoBanner.id, nome: jogoNoBanner.nome, plataforma: jogoNoBanner.plataforma, preco: jogoNoBanner.preco, precoAntigo: jogoNoBanner.precoAntigo, desconto: jogoNoBanner.desconto } 
          })}
        >
          <ImageBackground 
            source={jogoNoBanner.imagem} 
            style={styles.imagemDestaque}
            imageStyle={{ borderRadius: 10 }}
          >
            <View style={styles.overlayDestaque}>
              <Text style={styles.textoDestaque}>{jogoNoBanner.nome}</Text>
              <TouchableOpacity 
                style={styles.botaoComprarDestaque} 
                onPress={() => router.push({ 
                  pathname: '/carrinho', 
                  params: { nome: jogoNoBanner.nome, plataforma: jogoNoBanner.plataforma, precoNovo: jogoNoBanner.preco, precoAntigo: jogoNoBanner.precoAntigo } 
                })}
              >
                <Text style={styles.textoBotaoComprar}>R$ {jogoNoBanner.preco}  Comprar</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        <View style={styles.controlesCarrossel}>
          <TouchableOpacity onPress={slideAnterior}><Text style={styles.seta}>←</Text></TouchableOpacity>
          <View style={styles.bolinhasContainer}>
            {Array.from({ length: totalSlides }).map((_, index) => (
              <View key={index} style={[styles.bolinha, slideAtual === index && styles.bolinhaAtiva]} />
            ))}
          </View>
          <TouchableOpacity onPress={proximoSlide}><Text style={styles.seta}>→</Text></TouchableOpacity>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.tituloSecao}>{tituloSecao}</Text>
      </View>
    </>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>😢</Text>
      <Text style={styles.emptyText}>Não há nenhum jogo com este nome.</Text>
      <TouchableOpacity 
        style={styles.emptyButton} 
        onPress={() => router.push('/home')}
      >
        <Text style={styles.emptyButtonText}>Ver todos os jogos</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item: jogo }: { item: any }) => (
    <TouchableOpacity 
      style={styles.cardProduto} 
      onPress={() => router.push({ 
        pathname: '/detalhes', 
        params: { id: jogo.id, nome: jogo.nome, plataforma: jogo.plataforma, preco: jogo.preco, precoAntigo: jogo.precoAntigo, desconto: jogo.desconto } 
      })}
    >
      <Image source={jogo.imagem} style={styles.imagemCardProduto} resizeMode="cover" />
      <Text style={styles.tituloPlataforma}>{jogo.plataforma}</Text>
      <Text style={styles.nomeJogoCard}>{jogo.nome}</Text>
      
      <TouchableOpacity 
        style={styles.botaoComprarCard}
        onPress={() => router.push({
          pathname: '/carrinho',
          params: { nome: jogo.nome, plataforma: jogo.plataforma, precoNovo: jogo.preco, precoAntigo: jogo.precoAntigo }
        })}
      >
        <Text style={styles.textoBotaoComprarCard}>R$ {jogo.preco}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <FlatList
        style={styles.container}
        data={jogosFiltrados}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.rowGrid}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  carouselContainer: { paddingHorizontal: 20, width: '100%', marginBottom: 10 },
  bannerWrapper: { width: '100%', height: 180, borderRadius: 10, borderWidth: 1, borderColor: '#0085A1', overflow: 'hidden' },
  imagemDestaque: { width: '100%', height: '100%', justifyContent: 'flex-end' },
  overlayDestaque: { width: '100%', height: '100%', padding: 15, backgroundColor: 'rgba(0,0,0,0.1)', justifyContent: 'flex-end', alignItems: 'flex-start' },
  textoDestaque: { color: '#0085A1', fontWeight: 'bold', fontSize: 22, marginBottom: 5, textShadowColor: 'rgba(255, 255, 255, 0.8)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 5},
  botaoComprarDestaque: { backgroundColor: '#00FF00', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5 },
  textoBotaoComprar: { color: '#000', fontWeight: 'bold' },
  controlesCarrossel: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  seta: { fontSize: 24, paddingHorizontal: 10 },
  bolinhasContainer: { flexDirection: 'row' },
  bolinha: { width: 10, height: 10, borderRadius: 5, borderWidth: 1, borderColor: '#000', marginHorizontal: 4 },
  bolinhaAtiva: { backgroundColor: '#000' },
  
  sectionHeader: { paddingHorizontal: 20, marginBottom: 15, marginTop: 5 },
  tituloSecao: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#FFF', 
    textShadowColor: '#000000',
    textShadowOffset: { width: 1.5, height: 1.5 },
    textShadowRadius: 1
  },
  
  rowGrid: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  cardProduto: { width: '48%', backgroundColor: '#34A8DB', borderRadius: 10, alignItems: 'center', paddingBottom: 10, marginBottom: 15, borderWidth: 1 },
  imagemCardProduto: { width: '100%', height: 100, backgroundColor: '#ccc', borderTopLeftRadius: 10, borderTopRightRadius: 10, marginBottom: 5 },
  tituloPlataforma: { color: '#fff', fontWeight: 'bold', marginBottom: 2 },
  nomeJogoCard: { color: '#fff', fontSize: 12, marginBottom: 5, textAlign: 'center', paddingHorizontal: 5 },
  botaoComprarCard: { backgroundColor: '#00FF00', paddingHorizontal: 20, paddingVertical: 5, borderRadius: 5 },
  textoBotaoComprarCard: { color: '#000', fontWeight: 'bold' },

  emptyContainer: { alignItems: 'center', justifyContent: 'center', padding: 40, marginTop: 20 },
  emptyIcon: { fontSize: 50, marginBottom: 10 },
  emptyText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, textShadowColor: '#000000', textShadowOffset: {width: 1.5, height: 1.5}, textShadowRadius: 1 },
  emptyButton: { backgroundColor: '#0085A1', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  emptyButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});