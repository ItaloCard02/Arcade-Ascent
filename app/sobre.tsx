import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
import Header from '../components/Header';

export default function SobreScreen() {
  return (
    <ScrollView style={styles.mainScroll} contentContainerStyle={{ paddingBottom: 40 }}>
      
      <Header mostrarVoltar={true} />

      <View style={styles.container}>
        
        <View style={styles.logoSection}>
          <Text style={styles.appName}>ARCADE ASCENT</Text>
          <Text style={styles.tagline}>Sua jornada gamer começa aqui.</Text>
        </View>

        
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Informações Corporativas</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Proprietário:</Text>
            <Text style={styles.value}>Italo Suporte & Co.</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>No mercado desde:</Text>
            <Text style={styles.value}>Janeiro de 2018 (6 anos)</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Endereço:</Text>
            <Text style={styles.value}>Av. Paulista, 1000 - Bela Vista, São Paulo - SP</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Contato:</Text>
            <TouchableOpacity onPress={() => Linking.openURL('tel:08007005050')}>
              <Text style={[styles.value, styles.linkText]}>(11) 98765-4321 / 0800-700-5050</Text>
            </TouchableOpacity>
          </View>
        </View>

        
        <View style={styles.securitySection}>
          <Text style={styles.sectionTitle}>Compra 100% Segura</Text>
          <View style={styles.sealsContainer}>
            <View style={styles.sealBox}>
              <Text style={styles.sealIcon}>🛡️</Text>
              <Text style={styles.sealText}>SSL Blindado</Text>
            </View>
            <View style={styles.sealBox}>
              <Text style={styles.sealIcon}>✅</Text>
              <Text style={styles.sealText}>Google Safe</Text>
            </View>
            <View style={styles.sealBox}>
              <Text style={styles.sealIcon}>💎</Text>
              <Text style={styles.sealText}>Loja Diamante</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footerText}>Versão 1.0.4 - Arcade Ascent Inc.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainScroll: { flex: 1, backgroundColor: 'transparent', paddingTop: 40 },
  container: { paddingHorizontal: 20, alignItems: 'center' },
  
  logoSection: { alignItems: 'center', marginVertical: 30 },
  appName: { fontSize: 28, fontWeight: 'bold', color: '#0085A1', letterSpacing: 1 },
  tagline: { fontSize: 14, color: '#666', marginTop: 5 },

  infoCard: { 
    backgroundColor: '#FFFFFF', 
    width: '100%', 
    borderRadius: 15, 
    padding: 20, 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 5,
    marginBottom: 25 
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#EEE', paddingBottom: 5 },
  
  infoRow: { marginBottom: 12 },
  label: { fontSize: 13, color: '#888', fontWeight: 'bold', textTransform: 'uppercase' },
  value: { fontSize: 16, color: '#333', marginTop: 2 },
  linkText: { color: '#0085A1', textDecorationLine: 'underline' },

  securitySection: { alignItems: 'center', width: '100%', marginBottom: 30 },
  sealsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 10 },
  sealBox: { alignItems: 'center', backgroundColor: '#F0F9FF', padding: 10, borderRadius: 10, width: '30%' },
  sealIcon: { fontSize: 24, marginBottom: 5 },
  sealText: { fontSize: 10, fontWeight: 'bold', color: '#0085A1', textAlign: 'center' },

  footerText: { fontSize: 12, color: '#999', marginTop: 10 }
});