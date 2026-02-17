import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { RezultatCalcul } from '@/lib/types';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: '#333',
    paddingBottom: 10
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 3,
    fontSize: 10
  },
  infoLabel: {
    fontWeight: 'bold',
    marginRight: 5,
    width: 80
  },
  section: {
    marginTop: 20,
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    padding: 5
  },
  table: {
    width: '100%'
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#333',
    color: '#fff',
    fontWeight: 'bold',
    padding: 5
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: 1,
    borderBottomColor: '#ddd',
    padding: 5
  },
  tableRowTotal: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
    padding: 5,
    marginTop: 5
  },
  colDenumire: {
    flex: 2
  },
  colCantitate: {
    flex: 1,
    textAlign: 'right'
  },
  colMasa: {
    flex: 2
  },
  colPreparat: {
    flex: 2
  },
  colNumber: {
    flex: 1,
    textAlign: 'right'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#666',
    borderTop: 1,
    borderTopColor: '#ddd',
    paddingTop: 10
  }
});

interface RaportPDFProps {
  data: string;
  numeBucatar: string;
  nrPortii: number;
  rezultat: RezultatCalcul;
}

export function RaportPDF({ data, numeBucatar, nrPortii, rezultat }: RaportPDFProps) {
  const numeCresa = process.env.NEXT_PUBLIC_NUME_CRESA || 'Creșa';
  
  const parseDate = (dateStr: string): Date => {
    const parts = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
    return new Date(parts + 'T00:00:00');
  };
  
  const dataFormatata = parseDate(data).toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{numeCresa}</Text>
          <Text style={styles.subtitle}>Raport Zilnic Bucătărie</Text>
        </View>

        <View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Data:</Text>
            <Text>{dataFormatata}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Bucătar:</Text>
            <Text>{numeBucatar}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nr. Porții:</Text>
            <Text>{nrPortii}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingrediente Necesare</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.colDenumire}>Denumire</Text>
              <Text style={styles.colCantitate}>Cantitate</Text>
            </View>
            {rezultat.ingrediente.map((ing, idx) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={styles.colDenumire}>{ing.ingredient.denumire}</Text>
                <Text style={styles.colCantitate}>
                  {ing.cantitate_raport} {ing.unitate_raport}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Macronutrienți per Porție</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.colMasa}>Masă</Text>
              <Text style={styles.colPreparat}>Preparat</Text>
              <Text style={styles.colNumber}>Calorii</Text>
              <Text style={styles.colNumber}>Prot. (g)</Text>
              <Text style={styles.colNumber}>Gluc. (g)</Text>
              <Text style={styles.colNumber}>Grăs. (g)</Text>
            </View>
            {rezultat.macronutrienti.map((masa, idx) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={styles.colMasa}>{masa.masa}</Text>
                <Text style={styles.colPreparat}>{masa.denumire_reteta}</Text>
                <Text style={styles.colNumber}>{masa.calorii}</Text>
                <Text style={styles.colNumber}>{masa.proteine}</Text>
                <Text style={styles.colNumber}>{masa.glucide}</Text>
                <Text style={styles.colNumber}>{masa.grasimi}</Text>
              </View>
            ))}
            <View style={styles.tableRowTotal}>
              <Text style={[styles.colMasa, { flex: 4 }]}>TOTAL</Text>
              <Text style={styles.colNumber}>{rezultat.total_macronutrienti.calorii}</Text>
              <Text style={styles.colNumber}>{rezultat.total_macronutrienti.proteine}</Text>
              <Text style={styles.colNumber}>{rezultat.total_macronutrienti.glucide}</Text>
              <Text style={styles.colNumber}>{rezultat.total_macronutrienti.grasimi}</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Generat automat - {new Date().toLocaleString('ro-RO')}</Text>
        </View>
      </Page>
    </Document>
  );
}
