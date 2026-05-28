import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Header from '../components/Header';

export default function DetalhesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const galeriasPorId: Record<string, any[]> = {
    'kh2': [
      require('../assets/kh2.jpeg'),
      require('../assets/kh2painel2.jpg'),
      require('../assets/kh2painel3.jpg'),
      require('../assets/kh2painel4.webp')
    ],
    '1': [
      require('../assets/pvz.jpg'),
      require('../assets/pvz.jpg'),
      require('../assets/pvz.jpg'),
      require('../assets/pvz.jpg')
    ],
    '2': [
      require('../assets/halo.jpg'),
      require('../assets/halo.jpg'),
      require('../assets/halo.jpg'),
      require('../assets/halo.jpg')
    ],
    '3': [
      require('../assets/mario.png'),
      require('../assets/mario.png'),
      require('../assets/mario.png'),
      require('../assets/mario.png')
    ],
    '4': [
      require('../assets/gow.jpg'),
      require('../assets/gow.jpg'),
      require('../assets/gow.jpg'),
      require('../assets/gow.jpg')
    ]
  };

  const infoPorId: Record<string, { descricao: string; requisitos: string }> = {
    'kh2': {
      descricao: "Junte-se a Sora, Pato Donald e Pateta em uma jornada épica através de diversos mundos da Disney e Final Fantasy para impedir os Heartless e a misteriosa Organization XIII.",
      requisitos: "SO: Windows 10 (64-bit)\nProcessador: Intel Core i3\nMemória: 8 GB de RAM\nPlaca de vídeo: NVIDIA GTX 750\nArmazenamento: 70 GB"
    },
    '1': { 
      descricao: "Prepare-se para adubar suas plantas! Uma horda de zumbis famintos por cérebros está prestes a invadir sua casa. Use seu arsenal de plantas mutantes para deter o ataque.", 
      requisitos: "SO: Windows XP/Vista/7\nProcessador: 1.2GHz+\nMemória: 1 GB de RAM\nPlaca de vídeo: 128MB de memória\nArmazenamento: 65 MB" 
    },
    '2': { 
      descricao: "Quando toda a esperança foi perdida e o destino da humanidade está em risco, o Master Chief está pronto para encarar o inimigo mais cruel que já enfrentou.", 
      requisitos: "SO: Windows 10 RS5\nProcessador: AMD Ryzen 5\nMemória: 8 GB de RAM\nPlaca de vídeo: AMD RX 570\nArmazenamento: 50 GB" 
    },
    '3': { 
      descricao: "Junte-se ao Mario em uma imensa aventura 3D pelo mundo todo! Use as novas habilidades dele para coletar Luas, ligar a nave Odyssey e salvar a Princesa Peach.", 
      requisitos: "Plataforma: Exclusivo para Nintendo Switch\nModos compatíveis: TV, semiportátil, portátil\nTamanho do arquivo: 5.6 GB" 
    },
    '4': { 
      descricao: "Embarque em uma jornada épica e comovente onde Kratos e Atreus lutam para se apegar e desapegar. O Fimbulwinter está chegando.", 
      requisitos: "SO: Windows 10 64-bit\nProcessador: Intel i5-2500K\nMemória: 8 GB de RAM\nPlaca de vídeo: NVIDIA GTX 1060\nArmazenamento: 90 GB" 
    }
  };

  const nomeJogo = params.nome || 'Jogo Desconhecido';
  const plataformaJogo = params.plataforma || 'Plataforma';
  const precoNovo = params.preco || '00,00';
  const precoAntigo = params.precoAntigo || '00,00';
  const desconto = params.desconto || '0%';
  const idDoJogo = params.id as string;

  const galeriaDeImagens = galeriasPorId[idDoJogo] || [];
  const infoDoJogo = infoPorId[idDoJogo] || { descricao: "Descrição indisponível.", requisitos: "Requisitos não informados." };

  const [indiceImagemAtiva, setIndiceImagemAtiva] = useState(0);

  return (
    <ScrollView style={styles.mainScroll} contentContainerStyle={{ paddingBottom: 40 }}>
      
      <Header mostrarVoltar={true} />

      <View style={styles.cardPrincipalContainer}>
        
        <View style={styles.titleContainer}>
          <Text style={styles.platformIcon}>{plataformaJogo}</Text>
          <Text style={styles.gameTitle}>{nomeJogo}</Text>
        </View>

        <View style={styles.galeriaContainer}>
          <View style={styles.wrapperImagemPrincipal}>
            {galeriaDeImagens[indiceImagemAtiva] ? (
              <Image source={galeriaDeImagens[indiceImagemAtiva]} style={styles.imagemPrincipal} resizeMode="cover" />
            ) : (
              <View style={[styles.imagemPrincipal, { backgroundColor: '#E0F7FA', justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Sem imagem</Text>
              </View>
            )}
            <TouchableOpacity style={styles.setaEsquerda}><Text style={styles.setaTexto}>←</Text></TouchableOpacity>
            <TouchableOpacity style={styles.setaDireita}><Text style={styles.setaTexto}>→</Text></TouchableOpacity>
          </View>

          <View style={styles.miniaturasContainer}>
            {galeriaDeImagens.map((imagemDaVez, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.miniatura, indiceImagemAtiva === index && styles.miniaturaAtiva]}
                onPress={() => setIndiceImagemAtiva(index)}
                activeOpacity={0.7}
              >
                {imagemDaVez ? (
                  <Image source={imagemDaVez} style={styles.imagemMiniatura} resizeMode="cover" />
                ) : (
                   <Text style={{color: '#999'}}>{index + 1}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.balaoInfoContainer}>
          <Text style={styles.balaoTitulo}>📖 Sobre o Jogo</Text>
          <Text style={styles.balaoTexto}>{infoDoJogo.descricao}</Text>
          <View style={styles.linhaDivisoria} />
          <Text style={styles.balaoTitulo}>⚙️ Requisitos Mínimos</Text>
          <Text style={styles.balaoTexto}>{infoDoJogo.requisitos}</Text>
        </View>

        <View style={styles.compraSection}>
          <View style={styles.rowPreco}>
            <View style={styles.tagDesconto}>
              <Text style={styles.textoDesconto}>{desconto}</Text>
            </View>
            <View>
              <Text style={styles.precoAntigo}>R$ {precoAntigo}</Text>
              <Text style={styles.precoNovo}>R$ {precoNovo}</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.botaoComprarGrande}
            onPress={() => router.push({
              pathname: '/carrinho',
              params: { nome: nomeJogo, plataforma: plataformaJogo, precoNovo: precoNovo, precoAntigo: precoAntigo }
            })}
          >
            <Text style={styles.textoBotaoComprarGrande}>🛒 Comprar</Text>
          </TouchableOpacity>
        </View>

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainScroll: { flex: 1, backgroundColor: 'transparent', paddingTop: 40 },
  
  cardPrincipalContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 15,
    paddingVertical: 20,
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },

  titleContainer: { paddingHorizontal: 20, marginBottom: 15 },
  platformIcon: { fontSize: 14, fontWeight: 'bold', color: '#0085A1', textTransform: 'uppercase' },
  gameTitle: { fontSize: 24, fontWeight: 'bold', color: '#000' },

  galeriaContainer: { paddingHorizontal: 20 },
  wrapperImagemPrincipal: { width: '100%', height: 220, borderRadius: 10, overflow: 'hidden', position: 'relative' },
  imagemPrincipal: { width: '100%', height: '100%' },
  setaEsquerda: { position: 'absolute', left: 10, top: '45%', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 20, padding: 5 },
  setaDireita: { position: 'absolute', right: 10, top: '45%', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 20, padding: 5 },
  setaTexto: { fontSize: 18, fontWeight: 'bold' },

  miniaturasContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  miniatura: { width: '23%', height: 60, backgroundColor: '#eee', borderRadius: 5, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'transparent', overflow: 'hidden' },
  miniaturaAtiva: { borderColor: '#0085A1' },
  imagemMiniatura: { width: '100%', height: '100%', borderRadius: 3 },

  balaoInfoContainer: {
    backgroundColor: '#F8F8F8', 
    marginHorizontal: 20,
    marginTop: 25,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE'
  },
  balaoTitulo: { fontSize: 16, fontWeight: 'bold', color: '#0085A1', marginBottom: 5 },
  balaoTexto: { fontSize: 14, color: '#444', lineHeight: 20, textAlign: 'justify' },
  linhaDivisoria: { height: 1, backgroundColor: '#EEEEEE', marginVertical: 15 },

  compraSection: { padding: 20, alignItems: 'center' },
  rowPreco: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  
  tagDesconto: { 
    backgroundColor: '#FF0000', 
    padding: 10, 
    borderRadius: 5, 
    marginRight: 15,
    borderWidth: 2, 
    borderColor: '#8B0000', 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3
  },
  textoDesconto: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  precoAntigo: { textDecorationLine: 'line-through', color: '#999', fontSize: 16 },
  precoNovo: { fontSize: 26, fontWeight: 'bold', color: '#000' },
  
  botaoComprarGrande: { 
    backgroundColor: '#00FF00', 
    width: '100%', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#008000', 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3
  },
  textoBotaoComprarGrande: { fontSize: 20, fontWeight: 'bold', color: '#000' }
});